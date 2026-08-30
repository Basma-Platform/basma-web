import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { getPostAuthPath } from '../utils/authRedirect';
import type {
  User,
  AuthContextType,
  RegisterPayload,
  LoginPayload,
  VerifyEmailPayload,
  ResetPasswordPayload,
} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // FIX (security + correctness): no more localStorage/sessionStorage
    // snapshot to trust blindly on load. Ask the backend "who am I" — the
    // httpOnly session cookie (sent automatically by the browser) is what
    // answers this, not anything JavaScript stored itself. If there's no
    // valid session, this 401s and we're simply logged out, no cleanup
    // needed since nothing was ever stored client-side to begin with.
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const redirectAfterAuth = useCallback(
    (authedUser: User) => {
      const path = getPostAuthPath(authedUser);
      if (path === '/verify-email') {
        navigate(path, { state: { email: authedUser.email, showToast: true } });
      } else {
        navigate(path);
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (data: RegisterPayload): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await authService.register(data);
        setUser(response.user);
        setIsAuthenticated(true);
        redirectAfterAuth(response.user);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectAfterAuth]
  );

  const login = useCallback(
    async (data: LoginPayload): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await authService.login(data);
        setUser(response.user);
        setIsAuthenticated(true);
        redirectAfterAuth(response.user);
      } catch (error) {
        setIsAuthenticated(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectAfterAuth]
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Destroys the real server-side session — a stolen cookie stops
      // working immediately after this, not just "until it expires".
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const verifyEmail = useCallback(
    async (data: VerifyEmailPayload): Promise<void> => {
      setIsLoading(true);
      try {
        await authService.verifyEmail(data);

        // FIX (the old infinite-loop / stale-closure saga): instead of
        // trying to read a locally-cached user object that may or may not
        // have loaded yet, just ask the server who's authenticated right
        // now. The session cookie (if this browser has one) is sent
        // automatically regardless of React's render/effect timing — this
        // sidesteps the entire class of race condition we kept working
        // around before, rather than patching around it again.
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          redirectAfterAuth(currentUser);
        } catch {
          // No active session on this device/browser — fine, it just means
          // the link was opened somewhere they weren't already logged in.
          setUser(null);
          setIsAuthenticated(false);
          navigate('/login', {
            state: { message: '✅ تم تفعيل حسابك بنجاح! يمكنك تسجيل الدخول الآن.' },
          });
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectAfterAuth, navigate]
  );

  const resendVerification = useCallback(async (email: string): Promise<void> => {
    await authService.resendVerification({ email });
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    await authService.forgotPassword({ email });
  }, []);

  const resetPassword = useCallback(
    async (data: ResetPasswordPayload): Promise<void> => {
      setIsLoading(true);
      try {
        await authService.resetPassword(data);
        navigate('/login', {
          state: { message: '✅ تم تحديث كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.' },
        });
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
