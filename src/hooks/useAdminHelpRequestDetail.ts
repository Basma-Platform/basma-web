import { useState, useCallback } from 'react';
import { adminHelpRequestService } from '../services/adminHelpRequestService';
import { toast } from 'react-toastify';
import type {
  AdminHelpRequestDetail,
  AdminHelpRequestAccessLog,
  AdminHelpRequestEncryptedFields,
} from '../types';

/**
 * Admin help-request detail + actions.
 * Used in: AdminHelpRequestDetailPage
 */
export const useAdminHelpRequestDetail = () => {
  const [detail, setDetail] = useState<AdminHelpRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  // ============================================
  // Fetch
  // ============================================
  const fetchDetail = useCallback(async (id: number) => {
    try {
      setDetailLoading(true);
      const data = await adminHelpRequestService.getDetail(id);
      setDetail(data);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 404) {
        toast.error(message || 'الطلب غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في تحميل التفاصيل');
      }
      setDetail(null);
      throw error;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDetail(null);
    setDetailLoading(false);
  }, []);

  // ============================================
  // Video (blob stream)
  // ============================================
  const viewVideo = useCallback(
    async (id: number, reason?: string): Promise<Blob> => {
      try {
        setVideoLoading(true);
        const blob = await adminHelpRequestService.viewVideo(id, reason);
        return blob;
      } catch (error: any) {
        const status = error.response?.status;
        if (status === 404) {
          toast.error('ملف الفيديو غير موجود');
        } else {
          toast.error(
            error.response?.data?.message || 'حدث خطأ في تحميل الفيديو'
          );
        }
        throw error;
      } finally {
        setVideoLoading(false);
      }
    },
    []
  );

  // ============================================
  // Unlock encrypted data
  //
  // ✅ CRITICAL FIX:
  //   We NO LONGER refetch after unlocking. The refetch returned
  //   `encrypted_unlocked: false` (since the resource hardcodes it)
  //   which overwrote our optimistic merge and made the fields
  //   disappear immediately.
  //
  //   Instead:
  //     1. Merge the unlocked values into the current detail state
  //     2. Also fetch the logs separately and merge ONLY the logs
  // ============================================
  const unlockData = useCallback(
    async (
      id: number,
      field: 'details' | 'contact' | 'region' | 'all',
      reason: string
    ): Promise<AdminHelpRequestEncryptedFields> => {
      try {
        setActionLoading(true);
        const response = await adminHelpRequestService.unlockData(
          id,
          field,
          reason
        );

        // Merge into current detail (keep everything else intact)
        setDetail((prev) =>
          prev
            ? {
                ...prev,
                encrypted_unlocked: true,
                encrypted_fields: {
                  ...prev.encrypted_fields,
                  ...response.data.values,
                },
              }
            : prev
        );

        // Refresh ONLY the access logs (not the whole detail)
        try {
          const logs = await adminHelpRequestService.getLogs(id);
          setDetail((prev) =>
            prev ? { ...prev, access_logs: logs.data } : prev
          );
        } catch {
          /* silent */
        }

        toast.success('تم فك تشفير البيانات');
        return response.data.values;
      } catch (error: any) {
        const status = error.response?.status;
        if (status === 422) {
          toast.error('يرجى كتابة سبب صحيح (5-500 حرف)');
        } else {
          toast.error(
            error.response?.data?.message || 'حدث خطأ في فك التشفير'
          );
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // Logs
  // ============================================
  const fetchLogs = useCallback(
    async (id: number): Promise<AdminHelpRequestAccessLog[]> => {
      try {
        const response = await adminHelpRequestService.getLogs(id);
        return response.data;
      } catch (error: any) {
        console.warn('Failed to load logs:', error);
        return [];
      }
    },
    []
  );

  // ============================================
  // Decisions
  // ============================================
  const approve = useCallback(
    async (id: number, adminNotes?: string) => {
      try {
        setActionLoading(true);
        const response = await adminHelpRequestService.approve(id, adminNotes);
        toast.success(response.message || 'تمت الموافقة على الطلب');
        await fetchDetail(id);
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 403) {
          toast.error(message || 'لا يمكن معالجة الطلب');
        } else {
          toast.error(message || 'حدث خطأ في الموافقة');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDetail]
  );

  const reject = useCallback(
    async (id: number, adminNotes: string) => {
      try {
        setActionLoading(true);
        const response = await adminHelpRequestService.reject(id, adminNotes);
        toast.success(response.message || 'تم رفض الطلب');
        await fetchDetail(id);
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 422) {
          toast.error(message || 'يرجى كتابة سبب الرفض');
        } else {
          toast.error(message || 'حدث خطأ في الرفض');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDetail]
  );

  const archive = useCallback(
    async (id: number, archiveReason: string) => {
      try {
        setActionLoading(true);
        const response = await adminHelpRequestService.archive(
          id,
          archiveReason
        );
        toast.success(response.message || 'تمت أرشفة الطلب');
        await fetchDetail(id);
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 403) {
          toast.error(message || 'فقط الطلبات المنشورة يمكن أرشفتها');
        } else {
          toast.error(message || 'حدث خطأ في الأرشفة');
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchDetail]
  );

  const deleteRequest = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const response = await adminHelpRequestService.delete(id);
      toast.success(response.message || 'تم حذف الطلب نهائياً');
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 404) {
        toast.error(message || 'الطلب غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في الحذف');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    detail,
    detailLoading,
    actionLoading,
    videoLoading,
    fetchDetail,
    reset,
    viewVideo,
    unlockData,
    fetchLogs,
    approve,
    reject,
    archive,
    deleteRequest,
  };
};

export default useAdminHelpRequestDetail;