import api from './api';
import type { Announcement, AnnouncementsResponse, FiltersResponse, SubCategory } from '../types';

export const announcementService = {
  // ============================================
  // Get Public Announcements
  // ============================================
  getPublicAnnouncements: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    governorate_id?: number;
    city_id?: number;
    category?: 'goods' | 'services';
    sub_category_id?: number | number[];
    type?: 'offer' | 'request';
    price_type?: 'free' | 'paid' | 'barter';
    privacy_type?: 'public' | 'verified_only' | 'region_only' | 'verified_region';
    sort?: 'newest' | 'oldest' | 'most_viewed';
    status?: 'active' | 'disabled' | 'deleted';
  }) => {
    console.log('📤 Sending params:', params);

    // Create a new params object
    const requestParams: any = {};

    // Copy all params except sub_category_id
    Object.keys(params || {}).forEach(key => {
      if (key !== 'sub_category_id') {
        requestParams[key] = (params as any)[key];
      }
    });

    // ✅ Handle sub_category_id as array - FIXED
    if (params?.sub_category_id) {
      const ids = Array.isArray(params.sub_category_id) 
        ? params.sub_category_id 
        : [params.sub_category_id];
      
      // ✅ Send as array - backend expects sub_category_id[] for multiple
      ids.forEach((id, index) => {
        requestParams[`sub_category_id[${index}]`] = id;
      });
    }

    console.log('📤 Final request params:', requestParams);

    const response = await api.get<AnnouncementsResponse>('/v1/announcements', {
      params: requestParams,
    });
    return response.data;
  },

  // ============================================
  // Get Single Announcement
  // ============================================
  getAnnouncement: async (id: number) => {
    const response = await api.get<Announcement>(`/v1/announcements/${id}`);
    return response.data;
  },

  // ============================================
  // Get Filter Options
  // ============================================
  getFilters: async () => {
    const response = await api.get<FiltersResponse>('/v1/announcements/filters');
    return response.data;
  },

  // ============================================
  // Get Sub-Categories Only
  // ============================================
  getSubCategories: async () => {
    const response = await api.get<{ data: SubCategory[] }>('/v1/sub-categories');
    return response.data;
  },
};