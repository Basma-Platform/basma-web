import api from "./api";

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "../types";

export const authService = {
  register: async (payload: RegisterPayload) => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      payload,
    );

    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await api.post<LoginResponse>("/auth/login", payload);

    return response.data;
  },

  logout: async () => {
    const response = await api.post<{
      message: string;
    }>("/auth/logout");

    return response.data;
  },

  resendVerificationEmail: async (email: string) => {
    const response = await api.post<{
      message: string;
    }>("/auth/email/verification-notification", { email });

    return response.data;
  },
};