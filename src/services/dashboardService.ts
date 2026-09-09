import api from './api';
import type { DashboardResponse } from '../types';

export const dashboardService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>('/v1/dashboard');
    return response.data;
  },
};