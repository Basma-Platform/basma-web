import api from './api';
import type { RegisterPayload, RegisterResponse } from '../types';

export const authService = {
  register: async (payload: RegisterPayload) => {
    const response = await api.post<RegisterResponse>('/v1/register', payload);
    return response.data;
  },

  resendVerificationEmail: async (email: string) => {
    const response = await api.post<{ message: string }>('/v1/email/verification-notification', {
      email,
    });
    return response.data;
  },
};