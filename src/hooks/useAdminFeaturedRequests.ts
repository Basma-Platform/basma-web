import { useState, useCallback } from 'react';
import { featuredRequestService } from '../services/featuredRequestService';
import { toast } from 'react-toastify';
import type {
  AdminFeaturedRequestListItem,
  AdminFeaturedStats,
  AdminFeaturedDetail,
  AdminFeaturedListResponse,
  AdminFeaturedApprovePayload,
  AdminFeaturedRejectPayload,
  AdminFeaturedDeletePayload,
} from '../types';

type PaginationMeta = AdminFeaturedListResponse['meta'];

export const useAdminFeaturedRequests = () => {
  // List
  const [requests, setRequests] = useState<AdminFeaturedRequestListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<AdminFeaturedStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Detail
  const [detail, setDetail] = useState<AdminFeaturedDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);

  // Actions
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // Fetch list
  // ============================================
  const fetchRequests = useCallback(
    async (params?: {
      status?: 'all' | 'pending' | 'approved' | 'rejected';
      payment_method?: 'palpay' | 'jawwal_pay' | 'bop';
      search?: string;
      sort?: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await featuredRequestService.adminGetRequests(params);
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

  // ============================================
  // Fetch stats
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await featuredRequestService.adminGetStats();
      setStats(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل الإحصائيات';
      toast.error(message);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============================================
  // Fetch detail
  // ============================================
  const fetchDetail = useCallback(async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await featuredRequestService.adminGetRequest(id);
      setDetail(data);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 404) {
        toast.error(message || 'الطلب غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في تحميل تفاصيل الطلب');
      }
      // Clear stale detail so the error UI can render
      setDetail(null);
      throw error;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ============================================
  // Approve
  // ============================================
  const approveRequest = useCallback(
    async (id: number, payload: AdminFeaturedApprovePayload = {}) => {
      try {
        setActionLoading(true);
        const response = await featuredRequestService.adminApprove(id, payload);
        toast.success(response.message || 'تمت الموافقة على الطلب بنجاح');

        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'approved',
                  status_label: response.request.status_label,
                  reviewed_at: response.request.reviewed_at,
                }
              : r
          )
        );

        setDetail((prev) =>
          prev && prev.id === id ? response.request : prev
        );

        setStats((prev) =>
          prev
            ? {
                ...prev,
                requests: {
                  ...prev.requests,
                  pending: Math.max(0, prev.requests.pending - 1),
                  approved: prev.requests.approved + 1,
                },
                revenue: {
                  ...prev.revenue,
                  total:
                    prev.revenue.total + (response.request.amount || 0),
                  this_month:
                    prev.revenue.this_month + (response.request.amount || 0),
                },
                today: {
                  ...prev.today,
                  reviewed: prev.today.reviewed + 1,
                },
              }
            : prev
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 400) {
          toast.error(message || 'لا يمكن معالجة هذا الطلب');
        } else {
          toast.error(message || 'حدث خطأ في الموافقة على الطلب');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // Reject
  // ============================================
  const rejectRequest = useCallback(
    async (id: number, payload: AdminFeaturedRejectPayload) => {
      try {
        setActionLoading(true);
        const response = await featuredRequestService.adminReject(id, payload);
        toast.success(response.message || 'تم رفض الطلب بنجاح');

        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'rejected',
                  status_label: response.request.status_label,
                  reviewed_at: response.request.reviewed_at,
                }
              : r
          )
        );

        setDetail((prev) =>
          prev && prev.id === id ? response.request : prev
        );

        setStats((prev) =>
          prev
            ? {
                ...prev,
                requests: {
                  ...prev.requests,
                  pending: Math.max(0, prev.requests.pending - 1),
                  rejected: prev.requests.rejected + 1,
                },
                today: {
                  ...prev.today,
                  reviewed: prev.today.reviewed + 1,
                },
              }
            : prev
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 422) {
          toast.error(message || 'يرجى التحقق من سبب الرفض');
        } else if (status === 400) {
          toast.error(message || 'لا يمكن معالجة هذا الطلب');
        } else {
          toast.error(message || 'حدث خطأ في رفض الطلب');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // Delete
  // ============================================
  const deleteRequest = useCallback(
    async (id: number, payload: AdminFeaturedDeletePayload = {}) => {
      try {
        setActionLoading(true);
        const response = await featuredRequestService.adminDelete(id, payload);
        toast.success(response.message || 'تم حذف الطلب بنجاح');

        setRequests((prev) => prev.filter((r) => r.id !== id));
        setMeta((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
        );
        setDetail((prev) => (prev && prev.id === id ? null : prev));
        setStats((prev) =>
          prev
            ? {
                ...prev,
                requests: {
                  ...prev.requests,
                  total: Math.max(0, prev.requests.total - 1),
                },
              }
            : prev
        );

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 404) {
          toast.error(message || 'الطلب غير موجود');
        } else {
          toast.error(message || 'حدث خطأ في حذف الطلب');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  const resetDetail = useCallback(() => {
    setDetail(null);
    setDetailLoading(true); // back to "loading" state
  }, []);

  return {
    requests,
    meta,
    loading,
    fetchRequests,
    stats,
    statsLoading,
    fetchStats,
    detail,
    detailLoading,
    fetchDetail,
    resetDetail,
    actionLoading,
    approveRequest,
    rejectRequest,
    deleteRequest,
  };
};

export default useAdminFeaturedRequests;