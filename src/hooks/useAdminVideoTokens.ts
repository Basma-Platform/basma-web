import { useState, useCallback } from 'react';
import { adminVideoTokenService } from '../services/adminVideoTokenService';
import { toast } from 'react-toastify';
import type {
  AdminVideoTokenListItem,
  AdminCreateVideoTokenPayload,
  AdminCreateVideoTokenResponse,
  AdminHelpRequestAccessLog,
} from '../types';

/**
 * Admin video tokens management.
 * Used in: AdminHelpRequestDetailPage (tokens section)
 */
export const useAdminVideoTokens = () => {
  const [tokens, setTokens] = useState<AdminVideoTokenListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // List tokens for a help request
  // ============================================
  const fetchTokens = useCallback(async (helpRequestId: number) => {
    try {
      setLoading(true);
      const response = await adminVideoTokenService.listForHelpRequest(
        helpRequestId
      );
      setTokens(response.data);
      return response.data;
    } catch (error: any) {
      console.warn('Failed to load video tokens:', error);
      setTokens([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Create new token
  //
  // ✅ Returns the FULL response so the caller can
  //    display `secure_url` to the admin.
  // ============================================
  const createToken = useCallback(
    async (
      helpRequestId: number,
      payload: AdminCreateVideoTokenPayload
    ): Promise<AdminCreateVideoTokenResponse> => {
      try {
        setActionLoading(true);
        const response = await adminVideoTokenService.create(
          helpRequestId,
          payload
        );
        toast.success(response.message || 'تم إنشاء رابط الفيديو');

        // Refresh the list
        try {
          await fetchTokens(helpRequestId);
        } catch {
          /* silent */
        }

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 422) {
          toast.error(message || 'يرجى التحقق من البيانات');
        } else {
          toast.error(message || 'حدث خطأ في إنشاء الرابط');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchTokens]
  );

  // ============================================
  // Revoke token
  // ============================================
  const revokeToken = useCallback(
    async (_helpRequestId: number, tokenId: number, reason?: string) => {
      try {
        setActionLoading(true);
        const response = await adminVideoTokenService.revoke(tokenId, reason);
        toast.success(response.message || 'تم إلغاء الرابط');

        setTokens((prev) =>
          prev.map((t) =>
            t.id === tokenId
              ? {
                  ...t,
                  is_revoked: true,
                  revoked_at: new Date().toISOString(),
                }
              : t
          )
        );
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 404) {
          toast.error(message || 'الرابط غير موجود');
        } else {
          toast.error(message || 'حدث خطأ في الإلغاء');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // Access log for a token
  // ============================================
  const fetchAccessLog = useCallback(
    async (
      tokenId: number
    ): Promise<{
      token_id: number;
      help_request: { id: number; title: string };
      issued_to_type: string;
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
    } | null> => {
      try {
        const response = await adminVideoTokenService.getAccessLog(tokenId);
        return response.data;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'حدث خطأ في تحميل سجل الوصول'
        );
        return null;
      }
    },
    []
  );

  return {
    tokens,
    loading,
    actionLoading,
    fetchTokens,
    createToken,
    revokeToken,
    fetchAccessLog,
  };
};

export default useAdminVideoTokens;