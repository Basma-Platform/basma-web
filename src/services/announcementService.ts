import api from './api';
import type { 
  Announcement, 
  AnnouncementsResponse, 
  FiltersResponse, 
  SubCategory,
  LikeResponse 
} from '../types';

export const announcementService = {
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

    const requestParams: any = {};
    Object.keys(params || {}).forEach(key => {
      if (key !== 'sub_category_id') {
        requestParams[key] = (params as any)[key];
      }
    });

    if (params?.sub_category_id) {
      const ids = Array.isArray(params.sub_category_id) 
        ? params.sub_category_id 
        : [params.sub_category_id];
      ids.forEach((id, index) => {
        requestParams[`sub_category_id[${index}]`] = id;
      });
    }

    const response = await api.get<AnnouncementsResponse>('/v1/announcements', {
      params: requestParams,
    });
    return response.data;
  },

  // ✅ استخدام CancelToken بدلاً من signal
  getAnnouncement: async (id: number, cancelToken?: any) => {
    const response = await api.get<Announcement>(`/v1/announcements/${id}`, {
      cancelToken: cancelToken,
    });
    return response.data;
  },

  getFilters: async () => {
    const response = await api.get<FiltersResponse>('/v1/announcements/filters');
    return response.data;
  },

  getSubCategories: async () => {
    const response = await api.get<{ data: SubCategory[] }>('/v1/sub-categories');
    return response.data;
  },

  toggleLike: async (id: number): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(`/v1/announcements/${id}/like`);
    return response.data;
  },
};