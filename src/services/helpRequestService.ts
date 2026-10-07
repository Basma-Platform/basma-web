import api from './api';
import type {
  HelpRequestsPublicResponse,
  HelpRequestPublic,
  HelpRequestRequirements,
  HelpRequestsUserResponse,
  HelpRequestUserDetail,
  HelpRequestCreateResponse,
} from '../types';

/**
 * Help Request Service
 * ═══════════════════════════════════════════════════════════
 * Endpoints:
 *  Public  →  GET  /donations/help-requests
 *             GET  /donations/help-requests/{id}
 *  User    →  GET  /user/help-requests/requirements
 *             GET  /user/help-requests
 *             POST /user/help-requests           (multipart)
 *             GET  /user/help-requests/{id}
 *             DELETE /user/help-requests/{id}
 * ═══════════════════════════════════════════════════════════
 */
export const helpRequestService = {
  // ============================================
  // PUBLIC
  // ============================================

  getPublicList: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<HelpRequestsPublicResponse> => {
    const response = await api.get<HelpRequestsPublicResponse>(
      '/v1/donations/help-requests',
      { params }
    );
    return response.data;
  },

  getPublicDetail: async (id: number): Promise<{ data: HelpRequestPublic }> => {
    const response = await api.get<{ data: HelpRequestPublic }>(
      `/v1/donations/help-requests/${id}`
    );
    return response.data;
  },

  // ============================================
  // USER (verified)
  // ============================================

  getRequirements: async (): Promise<HelpRequestRequirements> => {
    const response = await api.get<HelpRequestRequirements>(
      '/v1/user/help-requests/requirements'
    );
    return response.data;
  },

  /**
   * GET /api/v1/user/help-requests
   * Owner's help requests list.
   *
   * ✅ Now supports `sort` (newest | oldest | most_viewed)
   * ✅ Now supports `search` (matches public_title)
   */
  getMyList: async (params?: {
    status?: 'all' | 'pending' | 'approved' | 'rejected' | 'archived';
    sort?: 'newest' | 'oldest' | 'most_viewed';
    search?: string;
    per_page?: number;
    page?: number;
  }): Promise<HelpRequestsUserResponse> => {
    const response = await api.get<HelpRequestsUserResponse>(
      '/v1/user/help-requests',
      { params }
    );
    return response.data;
  },

  create: async (formData: FormData): Promise<HelpRequestCreateResponse> => {
    const response = await api.post<HelpRequestCreateResponse>(
      '/v1/user/help-requests',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  getMyDetail: async (id: number): Promise<HelpRequestUserDetail> => {
    const response = await api.get<HelpRequestUserDetail>(
      `/v1/user/help-requests/${id}`
    );
    return response.data;
  },

  delete: async (
    id: number,
    reason?: string
  ): Promise<{ message: string }> => {
    const trimmed = reason?.trim();
    const body = trimmed ? { reason: trimmed } : {};
    const response = await api.delete<{ message: string }>(
      `/v1/user/help-requests/${id}`,
      { data: body }
    );
    return response.data;
  },
};

export default helpRequestService;