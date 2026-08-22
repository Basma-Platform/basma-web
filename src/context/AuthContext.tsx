import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AxiosError } from "axios";
import { authService } from "../services/authService";
import { authStorage } from "../services/authStorage";

import type { LoginPayload, User } from "../types";

type LogoutResult = "success" | "expired" | "local";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<void>;

  logout: () => Promise<LogoutResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    () => authStorage.get()?.user ?? null,
  );

  const login = async (payload: LoginPayload) => {
    const response = await authService.login(payload);

    if (!response.token) {
      throw new Error("لم يُرجع الخادم رمز المصادقة");
    }

    const session = authStorage.save(response, payload.remember_me);

    setUser(session.user);
  };

  const logout = async (): Promise<LogoutResult> => {
    let result: LogoutResult = "success";

    try {
      await authService.logout();
    } catch (error) {
      result =
        error instanceof AxiosError && error.response?.status === 401
          ? "expired"
          : "local";
    } finally {
      /*
       * نحذف الجلسة محليًا في جميع الحالات:
       * نجاح Logout، انتهاء التوكن أو فشل الاتصال.
       */
      authStorage.clear();
      setUser(null);
    }

    return result;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }

  return context;
};
