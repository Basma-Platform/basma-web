import { useState, useCallback } from 'react';
import { adminDonationInquiryService } from '../services/adminDonationInquiryService';
import { toast } from 'react-toastify';
import type {
  AdminDonationInquiryListItem,
  AdminDonationInquiryDetail,
  AdminDonationInquiryStats,
  AdminDonationInquiriesListResponse,
  DonationInquiryStatusPayload,
} from '../types';

type PaginationMeta = AdminDonationInquiriesListResponse['meta'];

/**
 * Admin donation inquiries (list + detail + status changes).
 * Used in: AdminInquiriesListPage, AdminInquiryDetailPage
 *
 * ⚠️ After any mutation (updateStatus / addNote), we re-fetch the
 *    full detail from the server. This is because the mutation
 *    responses only contain PARTIAL data (no nested `help_request`,
 *    `donor.user`, `video_tokens`, etc.), which would crash the page
 *    if we stored them directly in `detail`.
 */
export const useAdminDonationInquiries = () => {
  // List
  const [inquiries, setInquiries] = useState<AdminDonationInquiryListItem[]>(
    []
  );
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<AdminDonationInquiryStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Detail
  const [detail, setDetail] = useState<AdminDonationInquiryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Actions
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // List
  // ============================================
  const fetchList = useCallback(
    async (params?: {
      status?: 'all' | 'new' | 'contacted' | 'completed' | 'cancelled';
      search?: string;
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await adminDonationInquiryService.getList(params);
        setInquiries(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'حدث خطأ في تحميل الاستفسارات'
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await adminDonationInquiryService.getStats();
      setStats(data);
      return data;
    } catch (error: any) {
      console.warn('Failed to load inquiry stats:', error);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============================================
  // Detail
  // ============================================
  const fetchDetail = useCallback(async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await adminDonationInquiryService.getDetail(id);
      setDetail(data);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 404) {
        toast.error(message || 'الاستفسار غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في تحميل التفاصيل');
      }
      setDetail(null);
      throw error;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setDetail(null);
  }, []);

  // ============================================
  // Status change — refresh full detail after success
  // ============================================
  const updateStatus = useCallback(
    async (id: number, payload: DonationInquiryStatusPayload) => {
      try {
        setActionLoading(true);
        const response = await adminDonationInquiryService.updateStatus(
          id,
          payload
        );
        toast.success(response.message || 'تم تحديث حالة الاستفسار');

        // ✅ Update local LIST item (uses partial data — safe)
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: response.data.status,
                  status_label: response.data.status_label,
                  admin_notes: response.data.admin_notes,
                  handled_at: response.data.handled_at,
                }
              : i
          )
        );

        // ✅ CRITICAL: Re-fetch full detail from server instead of
        //    using `response.data` (which is partial and would crash
        //    the detail page when it accesses `detail.help_request`).
        try {
          await fetchDetail(id);
        } catch {
          // Non-fatal — toast handled inside fetchDetail
        }

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 422) {
          toast.error(message || 'يرجى التحقق من البيانات');
        } else {
          toast.error(message || 'حدث خطأ في تحديث الحالة');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDetail]
  );

  // ============================================
  // Add note — refresh full detail after success
  // ============================================
  const addNote = useCallback(
    async (id: number, adminNotes: string) => {
      try {
        setActionLoading(true);
        const response = await adminDonationInquiryService.addNote(
          id,
          adminNotes
        );
        toast.success(response.message || 'تمت إضافة الملاحظة');

        // ✅ Update local LIST item (partial is fine for list)
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, admin_notes: response.data.admin_notes } : i
          )
        );

        // ✅ CRITICAL: Re-fetch full detail from server.
        try {
          await fetchDetail(id);
        } catch {
          // Non-fatal — toast handled inside fetchDetail
        }

        return response;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'حدث خطأ في إضافة الملاحظة'
        );
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDetail]
  );

  return {
    inquiries,
    meta,
    stats,
    loading,
    statsLoading,
    fetchList,
    fetchStats,
    detail,
    detailLoading,
    fetchDetail,
    resetDetail,
    actionLoading,
    updateStatus,
    addNote,
  };
};

export default useAdminDonationInquiries;