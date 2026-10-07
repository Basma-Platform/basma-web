import api from './api';
import type {
  AdminHelpRequestsListResponse,
  AdminHelpRequestDetail,
  AdminHelpRequestStats,
  AdminHelpRequestAccessLog,
  AdminHelpRequestEncryptedFields,
} from '../types';

/**
 * Admin Help Request Service
 * ═══════════════════════════════════════════════════════════
 *  GET    /admin/help-requests                     → list + stats
 *  GET    /admin/help-requests/{id}                → detail
 *  GET    /admin/help-requests/{id}/video          → video blob
 *  POST   /admin/help-requests/{id}/access         → decrypt data
 *  GET    /admin/help-requests/{id}/logs           → access trail
 *  POST   /admin/help-requests/{id}/approve
 *  POST   /admin/help-requests/{id}/reject
 *  POST   /admin/help-requests/{id}/archive
 *  DELETE /admin/help-requests/{id}                → permanent delete
 *  GET    /admin/help-requests/stats               → stats only
 * ═══════════════════════════════════════════════════════════
 */
export const adminHelpRequestService = {
  /**
   * GET /api/v1/admin/help-requests
   */
  getList: async (params?: {
    status?: 'all' | 'pending' | 'approved' | 'rejected' | 'archived';
    search?: string;
    sort?: 'newest' | 'oldest' | 'most_viewed';
    page?: number;
    per_page?: number;
  }): Promise<AdminHelpRequestsListResponse> => {
    const response = await api.get<AdminHelpRequestsListResponse>(
      '/v1/admin/help-requests',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/help-requests/stats
   */
  getStats: async (): Promise<AdminHelpRequestStats> => {
    const response = await api.get<AdminHelpRequestStats>(
      '/v1/admin/help-requests/stats'
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/help-requests/{id}
   */
  getDetail: async (id: number): Promise<AdminHelpRequestDetail> => {
    const response = await api.get<AdminHelpRequestDetail>(
      `/v1/admin/help-requests/${id}`
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/help-requests/{id}/video
   * Returns a Blob (caller must createObjectURL + revoke).
   * Every call is logged in the audit trail.
   */
  viewVideo: async (id: number, reason?: string): Promise<Blob> => {
    const response = await api.get(
      `/v1/admin/help-requests/${id}/video`,
      {
        params: reason ? { reason } : undefined,
        responseType: 'blob',
        headers: { 'Cache-Control': 'no-store' },
      }
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/help-requests/{id}/access
   * Decrypts encrypted fields. Requires a reason.
   *
   * @param field  'details' | 'contact' | 'region' | 'all'
   * @param reason 5-500 chars
   */
  unlockData: async (
    id: number,
    field: 'details' | 'contact' | 'region' | 'all',
    reason: string
  ): Promise<{
    message: string;
    data: {
      field: string;
      values: AdminHelpRequestEncryptedFields;
    };
  }> => {
    const response = await api.post(
      `/v1/admin/help-requests/${id}/access`,
      { field, reason }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/help-requests/{id}/logs
   */
  getLogs: async (
    id: number
  ): Promise<{ data: AdminHelpRequestAccessLog[]; meta: { total: number } }> => {
    const response = await api.get(
      `/v1/admin/help-requests/${id}/logs`
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/help-requests/{id}/approve
   */
  approve: async (
    id: number,
    adminNotes?: string
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/v1/admin/help-requests/${id}/approve`,
      adminNotes ? { admin_notes: adminNotes } : {}
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/help-requests/{id}/reject
   */
  reject: async (
    id: number,
    adminNotes: string
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/v1/admin/help-requests/${id}/reject`,
      { admin_notes: adminNotes }
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/help-requests/{id}/archive
   */
  archive: async (
    id: number,
    archiveReason: string
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/v1/admin/help-requests/${id}/archive`,
      { archive_reason: archiveReason }
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/admin/help-requests/{id}
   * Permanent delete.
   */
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/v1/admin/help-requests/${id}`
    );
    return response.data;
  },
};

export default adminHelpRequestService;