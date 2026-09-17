import api from './api';
import type {
  UserAnnouncementsResponse,
  UserAnnouncementDetailResponse,
  CreateAnnouncementResponse,
  DeleteAnnouncementResponse,
  DisableAnnouncementResponse,
} from '../types';

export const userAnnouncementService = {
  /**
   * GET /api/v1/user/announcements
   * List my announcements (excludes soft-deleted)
   *
   * @param params - { status, search, sort, page, per_page }
   *   status: 'all' | 'active' | 'disabled' | 'featured'
   */
  getMyAnnouncements: async (params?: {
    status?: 'all' | 'active' | 'disabled' | 'featured';
    search?: string;
    sort?: 'newest' | 'oldest' | 'most_viewed';
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get<UserAnnouncementsResponse>(
      '/v1/user/announcements',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/user/announcements/{id}
   * Get announcement details (Owner view - includes disabled, excludes soft-deleted)
   */
  getAnnouncement: async (id: number) => {
    const response = await api.get<UserAnnouncementDetailResponse>(
      `/v1/user/announcements/${id}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/user/announcements
   * Create new announcement (multipart/form-data)
   */
  createAnnouncement: async (data: FormData) => {
    const response = await api.post<CreateAnnouncementResponse>(
      '/v1/user/announcements',
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * PUT /api/v1/user/announcements/{id}
   * Update announcement (multipart/form-data - uses POST + _method=PUT for Laravel)
   */
  updateAnnouncement: async (id: number, data: FormData) => {
    // Laravel requires POST + _method=PUT for multipart/form-data
    data.append('_method', 'PUT');
    const response = await api.post<UserAnnouncementDetailResponse>(
      `/v1/user/announcements/${id}`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/user/announcements/{id}
   * Soft delete announcement (removed from user view immediately)
   */
  deleteAnnouncement: async (id: number) => {
    const response = await api.delete<DeleteAnnouncementResponse>(
      `/v1/user/announcements/${id}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/user/announcements/{id}/disable
   * Disable announcement (hidden from public, auto soft-deleted after 14 days)
   */
  disableAnnouncement: async (id: number, reason?: string) => {
    const response = await api.post<DisableAnnouncementResponse>(
      `/v1/user/announcements/${id}/disable`,
      { reason }
    );
    return response.data;
  },

  /**
   * POST /api/v1/user/announcements/{id}/enable
   * Enable disabled announcement
   */
  enableAnnouncement: async (id: number) => {
    const response = await api.post<UserAnnouncementDetailResponse>(
      `/v1/user/announcements/${id}/enable`
    );
    return response.data;
  },
};

export default userAnnouncementService;