import api from './api';
import type { Announcement } from '../types';

export const announcementService = {
  getPublicAnnouncements: async (params?: {
    page?: number;
    search?: string;
    governorate_id?: number;
    city_id?: number;
    category?: string;
    type?: string;
    price_type?: string;
    sort?: string;
  }) => {
    console.log('📤 Sending params:', params);
    const response = await api.get<{
      data: Announcement[];
      current_page: number;
      last_page: number;
      total: number;
      per_page: number;
    }>('/v1/announcements', { params });
    return response.data;
  },

  getAnnouncement: async (id: number) => {
    const response = await api.get<Announcement>(`/v1/announcements/${id}`);
    return response.data;
  },
};