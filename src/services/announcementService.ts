import api from './api';
import type {
  Announcement,
  AnnouncementsResponse,
  FiltersResponse,
  Category,
  LikeResponse,
  FeaturedAnnouncementsResponse,
} from '../types';

export const announcementService = {
  // ============================================
  // Get Public Announcements (NON-FEATURED)
  // ============================================
  getPublicAnnouncements: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    governorate_id?: number;
    city_id?: number;
    /** ✨ Accepts a single id OR an array (multi-select) */
    category_id?: number | number[];
    type?: 'offer' | 'request';
    payment_type?: 'paid' | 'barter';
    privacy_type?:
      | 'public'
      | 'verified_only'
      | 'region_only'
      | 'verified_region';
    sort?: 'newest' | 'oldest' | 'most_viewed' | 'most_liked';
    status?: 'active' | 'disabled' | 'completed' | 'deleted';
    include_featured?: boolean;
  }) => {
    // ✨ Build params using URLSearchParams so we control the exact format
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        // ✨ CRITICAL: category_id must be serialized as category_id[] (repeated)
        if (key === 'category_id') {
          const ids = Array.isArray(value) ? value : [value];
          // Max 5 categories (backend silently truncates beyond that)
          ids.slice(0, 5).forEach((id) => {
            searchParams.append('category_id[]', String(id));
          });
          return;
        }

        // Everything else serializes normally
        searchParams.append(key, String(value));
      });
    }

    const response = await api.get<AnnouncementsResponse>(
      `/v1/announcements?${searchParams.toString()}`
    );
    return response.data;
  },

  // ============================================
  // Get Featured Announcements
  // ============================================
  getFeaturedAnnouncements: async (params?: {
    type?: 'offer' | 'request';
    split?: boolean;
    limit_per_type?: number;
    category_id?: number | number[];
    search?: string;
  }): Promise<FeaturedAnnouncementsResponse> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (key === 'category_id') {
          const ids = Array.isArray(value) ? value : [value];
          ids.slice(0, 5).forEach((id) => {
            searchParams.append('category_id[]', String(id));
          });
          return;
        }

        // Booleans must become "true"/"false" — URLSearchParams does that automatically
        searchParams.append(key, String(value));
      });
    }

    const qs = searchParams.toString();
    const response = await api.get<FeaturedAnnouncementsResponse>(
      `/v1/announcements/featured${qs ? `?${qs}` : ''}`
    );
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
    const response = await api.get<FiltersResponse>(
      '/v1/announcements/filters'
    );
    return response.data;
  },

  // ============================================
  // Get Categories (delegates to /v1/categories)
  // ============================================
  getCategories: async (): Promise<{ data: Category[]; meta: { total: number } }> => {
    const response = await api.get<{ data: Category[]; meta: { total: number } }>(
      '/v1/categories'
    );
    return response.data;
  },

  // ============================================
  // Toggle Like
  // ============================================
  toggleLike: async (id: number): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(
      `/v1/announcements/${id}/like`
    );
    return response.data;
  },
};

export default announcementService;