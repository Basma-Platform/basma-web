import api from './api';
import type { FAQ } from '../types';

export const faqService = {
  // Get all active FAQs (guest)
  getFAQs: async (params?: { category?: string; search?: string }) => {
    const response = await api.get<FAQ[]>('/v1/faqs', { params });
    return response.data;
  },
};
