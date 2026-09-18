import api from './api';
import type {
  VerificationStatusResponse,
  UploadIdResponse,
  AdminVerificationDetail,
  AdminVerificationsListResponse,
  VerificationActionPayload,
} from '../types';

export const verificationService = {
  // ============================================
  // USER SIDE
  // ============================================

  /**
   * POST /api/v1/user/verification/upload
   * Upload ID document for verification
   */
  uploadId: async (file: File): Promise<UploadIdResponse> => {
    const formData = new FormData();
    formData.append('id_image', file);

    const response = await api.post<UploadIdResponse>(
      '/v1/user/verification/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * GET /api/v1/user/verification/status
   * Get own verification status
   */
  getStatus: async (): Promise<VerificationStatusResponse> => {
    const response = await api.get<VerificationStatusResponse>(
      '/v1/user/verification/status'
    );
    return response.data;
  },

  // ============================================
  // ADMIN SIDE
  // ============================================

  /**
   * GET /api/v1/admin/verification-requests
   * List all verification requests (with filters)
   */
  getRequests: async (params?: {
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<AdminVerificationsListResponse> => {
    const response = await api.get<AdminVerificationsListResponse>(
      '/v1/admin/verification-requests',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/verification-requests/{id}
   * Get single request details
   */
  getRequest: async (id: number): Promise<AdminVerificationDetail> => {
    const response = await api.get<AdminVerificationDetail>(
      `/v1/admin/verification-requests/${id}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/verification-requests/{id}/approve
   */
  approve: async (
    id: number,
    payload: VerificationActionPayload = {}
  ): Promise<{ message: string; request: AdminVerificationDetail }> => {
    const response = await api.post(
      `/v1/admin/verification-requests/${id}/approve`,
      payload
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/verification-requests/{id}/reject
   */
  reject: async (
    id: number,
    payload: VerificationActionPayload
  ): Promise<{ message: string; request: AdminVerificationDetail }> => {
    const response = await api.post(
      `/v1/admin/verification-requests/${id}/reject`,
      payload
    );
    return response.data;
  },
};

export default verificationService;