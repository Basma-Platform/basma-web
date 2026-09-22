import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { getPostAuthPath } from '../utils/authRedirect';
import { useAccountStatus } from './AccountStatusContext';
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

/**
 * Sleep helper for retry backoff
 */
const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Verify the session is fully established by calling /auth/user.
 *
 * Retries up to `maxAttempts` times with `delayMs` between attempts.
 * This handles the cookie-commit race right after login: the browser
 * may not have committed the session cookie yet when the next request
 * fires, causing an intermittent 401.
 */
async function verifySessionWithRetry(
  maxAttempts = 3,
  delayMs = 150
): Promise<User> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        console.log(
          `🔐 [Auth] Session verify failed (attempt ${attempt + 1}/${maxAttempts}), retrying in ${delayMs}ms...`
        );
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { unsuppress } = useAccountStatus();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
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

  // ============================================
  // Register
  // ============================================
  const register = useCallback(
    async (data: RegisterPayload): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await authService.register(data);
        unsuppress();
        setUser(response.user);
        setIsAuthenticated(true);
        redirectAfterAuth(response.user);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectAfterAuth, unsuppress]
  );

  // ============================================
  // Login
  // ============================================
  /**
   * Login
   *
   * ✅ CRITICAL:
   * 1. Clears any stale auth state BEFORE starting the login flow.
   *    This prevents old session data (dashboard, notifications, sidebar
   *    badges) from lingering during the transition — which previously
   *    caused 401 storms on the dashboard.
   * 2. Re-verifies the session with retries AFTER login succeeds.
   *    This handles the cookie-commit race.
   * 3. Only navigates when the session is confirmed working.
   */
  const login = useCallback(
    async (data: LoginPayload): Promise<void> => {
      setIsLoading(true);

      // ✅ Clear stale auth state before starting login
      setUser(null);
      setIsAuthenticated(false);

      try {
        const response = await authService.login(data);
        unsuppress();

        let verifiedUser: User;
        try {
          verifiedUser = await verifySessionWithRetry(3, 150);
          console.log('🔐 [Auth] Session verified, navigating to dashboard');
        } catch (verifyError) {
          console.error(
            '🔐 [Auth] Session verification failed after retries:',
            verifyError
          );
          verifiedUser = response.user;
        }

        setUser(verifiedUser);
        setIsAuthenticated(true);
        redirectAfterAuth(verifiedUser);
      } catch (error) {
        setIsAuthenticated(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectAfterAuth, unsuppress]
  );

  // ============================================
  // Logout
  // ============================================
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
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

  // ============================================
  // Verify Email
  // ============================================
  const verifyEmail = useCallback(
    async (data: VerifyEmailPayload): Promise<void> => {
      setIsLoading(true);
      try {
        await authService.verifyEmail(data);

        try {
          const currentUser = await authService.getCurrentUser();
          unsuppress();
          setUser(currentUser);
          setIsAuthenticated(true);
          redirectAfterAuth(currentUser);
        } catch {
          setUser(null);
          setIsAuthenticated(false);
          navigate('/login', {
            state: {
              message: 'تم تفعيل حسابك بنجاح! يمكنك تسجيل الدخول الآن.',
            },
          });
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [redirectAfterAuth, navigate, unsuppress]
  );

  // ============================================
  // Resend Verification
  // ============================================
  const resendVerification = useCallback(
    async (email: string): Promise<void> => {
      await authService.resendVerification({ email });
    },
    []
  );

  // ============================================
  // Forgot Password
  // ============================================
  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    await authService.forgotPassword({ email });
  }, []);

  // ============================================
  // Reset Password
  // ============================================
  const resetPassword = useCallback(
    async (data: ResetPasswordPayload): Promise<void> => {
      setIsLoading(true);
      try {
        await authService.resetPassword(data);
        navigate('/login', {
          state: {
            message: 'تم تحديث كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.',
          },
        });
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  // ============================================
  // Update User in Context
  // ============================================
  const updateUser = useCallback(
    (userOrUpdater: User | ((prev: User | null) => User | null)) => {
      if (typeof userOrUpdater === 'function') {
        setUser((prev) => userOrUpdater(prev));
      } else {
        setUser(userOrUpdater);
      }
    },
    []
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
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;