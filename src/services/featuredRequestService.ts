import api from './api';
import type {
  FeaturedRequestPayload,
  FeaturedStatusResponse,
  RequestFeaturedResponse,
  FeaturedRequestsHistoryResponse,
} from '../types';

export const featuredRequestService = {
  /**
   * POST /api/v1/user/announcements/{id}/request-featured
   * Request featured status for an announcement (multipart/form-data with transfer image)
   */
  requestFeatured: async (
    announcementId: number,
    data: FeaturedRequestPayload
  ) => {
    const formData = new FormData();
    formData.append('duration_days', data.duration_days.toString());
    formData.append('payment_method', data.payment_method);
    formData.append('transfer_image', data.transfer_image);
    if (data.additional_notes) {
      formData.append('additional_notes', data.additional_notes);
    }

    const response = await api.post<RequestFeaturedResponse>(
      `/v1/user/announcements/${announcementId}/request-featured`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * GET /api/v1/user/announcements/{id}/featured-status
   * Get current featured status for an announcement
   */
  getFeaturedStatus: async (announcementId: number) => {
    const response = await api.get<FeaturedStatusResponse>(
      `/v1/user/announcements/${announcementId}/featured-status`
    );
    return response.data;
  },

  /**
   * GET /api/v1/user/featured-requests
   * Get my featured requests history (paginated)
   */
  getMyFeaturedRequests: async (params?: {
    page?: number;
    per_page?: number;
  }) => {
    const response = await api.get<FeaturedRequestsHistoryResponse>(
      '/v1/user/featured-requests',
      { params }
    );
    return response.data;
  },
};

export default featuredRequestService;