import { useState, useCallback } from 'react';
import { verificationService } from '../services/verificationService';
import { toast } from 'react-toastify';
import type {
  AdminVerificationRequest,
  AdminVerificationDetail,
  AdminVerificationsListResponse,
  VerificationActionPayload,
} from '../types';

/**
 * Hook for managing admin verification requests
 * Used in: AdminVerificationListPage, AdminVerificationDetailPage
 */
export const useAdminVerifications = () => {
  const [requests, setRequests] = useState<AdminVerificationRequest[]>([]);
  const [meta, setMeta] = useState<
    AdminVerificationsListResponse['meta'] | null
  >(null);
  const [stats, setStats] = useState<
    AdminVerificationsListResponse['stats'] | null
  >(null);
  const [detail, setDetail] = useState<AdminVerificationDetail | null>(null);

  const [loading, setLoading] = useState(false);
  // ✅ Initialize to true — the consumer (detail page) will always fetch on mount,
  //    so showing the skeleton from the very first render avoids the "flash of error".
  const [detailLoading, setDetailLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Fetch list of verification requests
   */
  const fetchRequests = useCallback(
    async (params?: {
      status?: 'all' | 'pending' | 'approved' | 'rejected';
      search?: string;
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await verificationService.getRequests(params);
        setRequests(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل الطلبات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch single request details
   */
  const fetchDetail = useCallback(async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await verificationService.getRequest(id);
      setDetail(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل تفاصيل الطلب';
      toast.error(message);
      // ✅ Clear stale detail on error so the error UI can render
      setDetail(null);
      throw error;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  /**
   * Approve request
   */
  const approveRequest = useCallback(
    async (id: number, payload: VerificationActionPayload = {}) => {
      try {
        setActionLoading(true);
        const response = await verificationService.approve(id, payload);
        toast.success(response.message);
        setStats((prev) =>
          prev
            ? {
                ...prev,
                pending: Math.max(0, prev.pending - 1),
                approved: prev.approved + 1,
              }
            : prev
        );
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في الموافقة على الطلب';
        toast.error(message);
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  /**
   * Reject request
   */
  const rejectRequest = useCallback(
    async (id: number, payload: VerificationActionPayload) => {
      try {
        setActionLoading(true);
        const response = await verificationService.reject(id, payload);
        toast.success(response.message);
        setStats((prev) =>
          prev
            ? {
                ...prev,
                pending: Math.max(0, prev.pending - 1),
                rejected: prev.rejected + 1,
              }
            : prev
        );
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في رفض الطلب';
        toast.error(message);
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  return {
    requests,
    meta,
    stats,
    detail,
    loading,
    detailLoading,
    actionLoading,
    fetchRequests,
    fetchDetail,
    approveRequest,
    rejectRequest,
  };
};

export default useAdminVerifications;