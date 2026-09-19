import api from './api';
import type {
  FeaturedRequestPayload,
  FeaturedStatusResponse,
  RequestFeaturedResponse,
  FeaturedRequestsHistoryResponse,
  UserFeaturedRequestDetail,
  AdminFeaturedListResponse,
  AdminFeaturedStats,
  AdminFeaturedDetail,
  AdminFeaturedApprovePayload,
  AdminFeaturedRejectPayload,
  AdminFeaturedDeletePayload,
} from '../types';

export const featuredRequestService = {
  // ============================================
  // USER SIDE
  // ============================================

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

  /**
   * GET /api/v1/user/featured-requests/{id}
   * Get a single featured request detail (owner-only)
   */
  getMyRequestDetail: async (id: number): Promise<UserFeaturedRequestDetail> => {
    const response = await api.get<UserFeaturedRequestDetail>(
      `/v1/user/featured-requests/${id}`
    );
    return response.data;
  },

  // ============================================
  // ADMIN SIDE
  // ============================================

  /**
   * GET /api/v1/admin/featured-requests
   * List all featured requests (with filters + stats)
   */
  adminGetRequests: async (params?: {
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    payment_method?: 'palpay' | 'jawwal_pay' | 'bop';
    search?: string;
    sort?: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
    page?: number;
    per_page?: number;
  }): Promise<AdminFeaturedListResponse> => {
    const response = await api.get<AdminFeaturedListResponse>(
      '/v1/admin/featured-requests',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/featured-requests/stats
   * Stats only (lightweight)
   */
  adminGetStats: async (): Promise<AdminFeaturedStats> => {
    const response = await api.get<AdminFeaturedStats>(
      '/v1/admin/featured-requests/stats'
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/featured-requests/{id}
   * Full details for a single request
   */
  adminGetRequest: async (id: number): Promise<AdminFeaturedDetail> => {
    const response = await api.get<AdminFeaturedDetail>(
      `/v1/admin/featured-requests/${id}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/featured-requests/{id}/approve
   */
  adminApprove: async (
    id: number,
    payload: AdminFeaturedApprovePayload = {}
  ): Promise<{ message: string; request: AdminFeaturedDetail }> => {
    const response = await api.post<{
      message: string;
      request: AdminFeaturedDetail;
    }>(`/v1/admin/featured-requests/${id}/approve`, payload);
    return response.data;
  },

  /**
   * POST /api/v1/admin/featured-requests/{id}/reject
   * admin_notes is required.
   */
  adminReject: async (
    id: number,
    payload: AdminFeaturedRejectPayload
  ): Promise<{ message: string; request: AdminFeaturedDetail }> => {
    const response = await api.post<{
      message: string;
      request: AdminFeaturedDetail;
    }>(`/v1/admin/featured-requests/${id}/reject`, payload);
    return response.data;
  },

  /**
   * DELETE /api/v1/admin/featured-requests/{id}
   * Optional reason is logged on the backend.
   */
  adminDelete: async (
    id: number,
    payload: AdminFeaturedDeletePayload = {}
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/v1/admin/featured-requests/${id}`,
      { data: payload }
    );
    return response.data;
  },
};

export default featuredRequestService;