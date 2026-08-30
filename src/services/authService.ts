import api from './api';
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  ResendVerificationPayload,
  User,
} from '../types';

/**
 * Auth Service - All authentication API calls
 * All endpoints are prefixed with /v1 as per backend routes
 */
export const authService = {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/v1/auth/login', data);
    return response.data;
  },

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/v1/auth/logout');
    return response.data;
  },

  /**
   * Get current authenticated user
   * GET /api/v1/auth/user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/v1/auth/user');
    return response.data;
  },

  /**
   * Verify email
   * GET /api/v1/auth/verify-email/{id}/{hash}?expires=...&signature=...
   *
   * Email verification legitimately uses Laravel's signed routes, so
   * expires/signature are still forwarded here.
   */
  verifyEmail: async (data: VerifyEmailPayload): Promise<{ message: string }> => {
    const response = await api.get<{ message: string }>(
      `/v1/auth/verify-email/${data.id}/${data.hash}`,
      {
        params: {
          expires: data.expires,
          signature: data.signature,
        },
      }
    );
    return response.data;
  },

  /**
   * Resend verification email
   * POST /api/v1/auth/resend-verification
   */
  resendVerification: async (data: ResendVerificationPayload): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/v1/auth/resend-verification', data);
    return response.data;
  },

  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordPayload): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/v1/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   * POST /api/v1/auth/reset-password
   *
   * FIX: no longer sends expires/signature — password reset validity is
   * enforced by Password::reset()'s own hashed-token + expiry check, not a
   * signed URL. Sending them was never doing anything useful on the backend.
   */
  resetPassword: async (data: ResetPasswordPayload): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/v1/auth/reset-password', {
      email: data.email,
      token: data.token,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    return response.data;
  },
};

export default authService;