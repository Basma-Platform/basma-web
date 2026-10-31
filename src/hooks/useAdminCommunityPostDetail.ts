import { useState, useCallback } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import { translateBackendMessage } from '../utils/helpRequestErrorMessages';
import type { AdminCommunityPostDetail } from '../types';

/**
 * Admin Community Post detail + all moderation actions.
 *
 * Used in:
 *  - AdminCommunityPostDetailPage
 */
export const useAdminCommunityPostDetail = () => {
  const [detail, setDetail] = useState<AdminCommunityPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // Fetch
  // ============================================
  const fetchDetail = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data = await communityService.adminGetPost(id);
      setDetail(data);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(message || 'المنشور غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في تحميل التفاصيل');
      }
      setDetail(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Approve
  // ============================================
  const approve = useCallback(
    async (id: number, adminNotes?: string) => {
      try {
        setActionLoading(true);
        const response = await communityService.adminApprove(id, {
          admin_notes: adminNotes,
        });

        toast.success(
          translateBackendMessage(response.message, response.message) ||
            'تمت الموافقة على المنشور ونشره'
        );

        setDetail(response.data);
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400) {
          toast.error(
            translateBackendMessage(message, message) ||
              'تمت معالجة هذا المنشور مسبقاً'
          );
        } else {
          toast.error(message || 'حدث خطأ في الموافقة');
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
  const reject = useCallback(async (id: number, adminNotes: string) => {
    try {
      setActionLoading(true);
      const response = await communityService.adminReject(id, {
        admin_notes: adminNotes,
      });

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم رفض المنشور'
      );

      setDetail(response.data);
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(
          translateBackendMessage(message, message) ||
            'تمت معالجة هذا المنشور مسبقاً'
        );
      } else if (status === 422) {
        toast.error('يرجى كتابة سبب الرفض');
      } else {
        toast.error(message || 'حدث خطأ في الرفض');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ============================================
  // Delete
  // ============================================
  const deletePost = useCallback(async (id: number, reason?: string) => {
    try {
      setActionLoading(true);
      const response = await communityService.adminDelete(id, { reason });

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم حذف المنشور بنجاح'
      );

      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(message || 'المنشور غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في الحذف');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ============================================
  // Pin
  // ============================================
  const pin = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const response = await communityService.adminPin(id);

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم تثبيت المنشور في الأعلى'
      );

      setDetail(response.data);
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(
          translateBackendMessage(message, message) ||
            'لا يمكن تثبيت هذا المنشور'
        );
      } else {
        toast.error(message || 'حدث خطأ في التثبيت');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ============================================
  // Unpin
  // ============================================
  const unpin = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const response = await communityService.adminUnpin(id);

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم إلغاء تثبيت المنشور'
      );

      setDetail(response.data);
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(
          translateBackendMessage(message, message) ||
            'المنشور غير مثبّت'
        );
      } else {
        toast.error(message || 'حدث خطأ في إلغاء التثبيت');
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ============================================
  // Reset
  // ============================================
  const reset = useCallback(() => {
    setDetail(null);
    setLoading(true);
  }, []);

  return {
    detail,
    loading,
    actionLoading,
    fetchDetail,
    approve,
    reject,
    deletePost,
    pin,
    unpin,
    reset,
  };
};

export default useAdminCommunityPostDetail;