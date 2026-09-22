import api from './api';
import type {
  VerificationRequirements,
  VerificationStatusResponse,
  UploadIdResponse,
  AdminVerificationDetail,
  AdminVerificationsListResponse,
  VerificationActionPayload,
  ExtractDataPayload,
  ExtractDataResponse,
  DocumentType,
} from '../types';

export const verificationService = {
  // ============================================
  // USER SIDE
  // ============================================

  /**
   * GET /api/v1/user/verification/requirements
   * Privacy notice + document types + image requirements
   */
  getRequirements: async (): Promise<VerificationRequirements> => {
    const response = await api.get<VerificationRequirements>(
      '/v1/user/verification/requirements'
    );
    return response.data;
  },

  /**
   * POST /api/v1/user/verification/upload
   * Upload ID document for verification
   * ⚠️ document_type is now REQUIRED
   */
  uploadId: async (
    file: File,
    documentType: DocumentType
  ): Promise<UploadIdResponse> => {
    const formData = new FormData();
    formData.append('id_image', file);
    formData.append('document_type', documentType);

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
   * GET /api/v1/admin/verification-requests/{id}/view-image
   * 🔒 Secured image stream (logs every access)
   *
   * Returns a Blob that must be converted to ObjectURL by caller
   * Caller is responsible for URL.revokeObjectURL() cleanup
   */
  viewImage: async (
    id: number,
    reason?: string
  ): Promise<Blob> => {
    const response = await api.get(
      `/v1/admin/verification-requests/${id}/view-image`,
      {
        params: reason ? { reason } : undefined,
        responseType: 'blob',
        // Prevents browser from caching the sensitive image
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/verification-requests/{id}/extract-data
   * Save admin-extracted data from ID
   */
  extractData: async (
    id: number,
    payload: ExtractDataPayload
  ): Promise<ExtractDataResponse> => {
    const response = await api.post<ExtractDataResponse>(
      `/v1/admin/verification-requests/${id}/extract-data`,
      payload
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