import api from './api';
import type { RegisterPayload, RegisterResponse } from '../types';

export const authService = {
  register: async (payload: RegisterPayload) => {
    const response = await api.post<RegisterResponse>('/auth/register', payload);
    return response.data;
  },
};