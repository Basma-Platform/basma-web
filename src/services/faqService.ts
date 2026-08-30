import api from './api';
import type { FAQ, PaginatedResponse } from '../types';

export const faqService = {
  // Get all active FAQs with pagination
  getFAQs: async (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
  }) => {
    const response = await api.get<PaginatedResponse<FAQ>>('/v1/faqs', { params });
    return response.data;
  },

  // Get all categories separately
  getCategories: async () => {
    const response = await api.get<{ categories: string[] }>('/v1/faqs/categories');
    return response.data.categories;
  },
};