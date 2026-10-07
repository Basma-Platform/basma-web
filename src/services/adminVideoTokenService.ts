import api from './api';
import type {
  AdminVideoTokensListResponse,
  AdminCreateVideoTokenPayload,
  AdminCreateVideoTokenResponse,
  AdminHelpRequestAccessLog,
} from '../types';

/**
 * Admin Video Token Service
 * ═══════════════════════════════════════════════════════════
 *  GET    /admin/help-requests/{id}/video-tokens
 *  POST   /admin/help-requests/{id}/video-token
 *  DELETE /admin/video-tokens/{id}/revoke
 *  GET    /admin/video-tokens/{id}/access-log
 * ═══════════════════════════════════════════════════════════
 */
export const adminVideoTokenService = {
  /**
   * GET /api/v1/admin/help-requests/{id}/video-tokens
   */
  listForHelpRequest: async (
    helpRequestId: number
  ): Promise<AdminVideoTokensListResponse> => {
    const response = await api.get<AdminVideoTokensListResponse>(
      `/v1/admin/help-requests/${helpRequestId}/video-tokens`
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/help-requests/{id}/video-token
   *
   * Body:
   *   - purpose (required)
   *   - expires_in_hours (required, one of: 6 | 24 | 48)
   *   - recipient_name/email/whatsapp (optional)
   */
  create: async (
    helpRequestId: number,
    payload: AdminCreateVideoTokenPayload
  ): Promise<AdminCreateVideoTokenResponse> => {
    const response = await api.post<AdminCreateVideoTokenResponse>(
      `/v1/admin/help-requests/${helpRequestId}/video-token`,
      payload
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/admin/video-tokens/{id}/revoke
   */
  revoke: async (
    tokenId: number,
    reason?: string
  ): Promise<{ message: string }> => {
    const trimmed = reason?.trim();
    const body = trimmed ? { reason: trimmed } : {};
    const response = await api.delete<{ message: string }>(
      `/v1/admin/video-tokens/${tokenId}/revoke`,
      { data: body }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/video-tokens/{id}/access-log
   */
  getAccessLog: async (
    tokenId: number
  ): Promise<{
    data: {
      token_id: number;
      issued_to_type: string;
      help_request: { id: number; title: string };
      recipient: {
        name: string | null;
        email: string | null;
        whatsapp: string | null;
      };
      max_views: number;
      views_used: number;
      expires_at: string;
      is_revoked: boolean;
      access_log: AdminHelpRequestAccessLog[];
    };
  }> => {
    const response = await api.get(
      `/v1/admin/video-tokens/${tokenId}/access-log`
    );
    return response.data;
  },
};

export default adminVideoTokenService;