import { useState, useCallback } from 'react';
import { reportService } from '../services/reportService';
import { toast } from 'react-toastify';
import type {
  AdminReportListItem,
  AdminReportsStats,
  AdminReportDetail,
  AdminReportsListResponse,
  ProcessReportPayload,
} from '../types';

type PaginationMeta = AdminReportsListResponse['meta'];

/**
 * Hook for managing admin reports.
 *
 * Used in: AdminReportsListPage, AdminReportDetailPage
 *
 * Provides:
 * - List with filters (status, target_type, priority, search, sort)
 * - Stats (separate endpoint for lightweight refresh + sidebar badge)
 * - Detail fetch
 * - Process action (warn / suspend / block / delete_content / reject)
 */
export const useAdminReports = () => {
  // List
  const [reports, setReports] = useState<AdminReportListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<AdminReportsStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Detail
  const [detail, setDetail] = useState<AdminReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Action
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // Fetch list
  // ============================================
  const fetchReports = useCallback(
    async (params?: {
      status?: 'all' | 'pending' | 'reviewed' | 'rejected';
      target_type?: 'all' | 'user' | 'announcement';
      priority?: 'all' | 'low' | 'medium' | 'high';
      search?: string;
      sort?: 'newest' | 'oldest' | 'priority';
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await reportService.adminGetReports(params);
        setReports(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل البلاغات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Fetch stats (lightweight)
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await reportService.adminGetStats();
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
      const data = await reportService.adminGetReport(id);
      setDetail(data);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(message || 'البلاغ غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في تحميل تفاصيل البلاغ');
      }
      throw error;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ============================================
  // Process report
  // ============================================
  const processReport = useCallback(
    async (id: number, payload: ProcessReportPayload) => {
      try {
        setActionLoading(true);
        const response = await reportService.adminProcessReport(id, payload);
        toast.success(response.message || 'تمت معالجة البلاغ بنجاح');

        // Update list item in place
        setReports((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: response.report.status,
                  status_label: response.report.status_label,
                }
              : r
          )
        );

        // Update detail if this is the one open
        setDetail((prev) =>
          prev && prev.id === id ? response.report : prev
        );

        // Update stats optimistically
        setStats((prev) => {
          if (!prev) return prev;
          const wasPending = prev.reports.pending > 0;
          const newStatus = response.report.status;

          return {
            ...prev,
            reports: {
              ...prev.reports,
              pending: wasPending ? prev.reports.pending - 1 : 0,
              reviewed:
                newStatus === 'reviewed'
                  ? prev.reports.reviewed + 1
                  : prev.reports.reviewed,
              rejected:
                newStatus === 'rejected'
                  ? prev.reports.rejected + 1
                  : prev.reports.rejected,
            },
            today: {
              ...prev.today,
              processed: prev.today.processed + 1,
            },
          };
        });

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400) {
          toast.error(message || 'لا يمكن معالجة هذا البلاغ');
        } else if (status === 422) {
          toast.error(message || 'يرجى التحقق من البيانات المدخلة');
        } else {
          toast.error(message || 'حدث خطأ في معالجة البلاغ');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // Reset detail (when leaving the detail page)
  // ============================================
  const resetDetail = useCallback(() => {
    setDetail(null);
  }, []);

  return {
    // List
    reports,
    meta,
    loading,
    fetchReports,

    // Stats
    stats,
    statsLoading,
    fetchStats,

    // Detail
    detail,
    detailLoading,
    fetchDetail,
    resetDetail,

    // Action
    actionLoading,
    processReport,
  };
};

export default useAdminReports;