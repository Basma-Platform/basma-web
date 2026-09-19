import { useState, useCallback } from 'react';
import { featuredRequestService } from '../services/featuredRequestService';
import { toast } from 'react-toastify';
import type { UserFeaturedRequestDetail } from '../types';

/**
 * Hook for fetching a single featured request detail (owner-only).
 *
 * Used in: FeaturedRequestDetailPage
 */
export const useUserFeaturedRequestDetail = () => {
  const [detail, setDetail] = useState<UserFeaturedRequestDetail | null>(null);
  // ✅ Start loading = true so the caller never sees the "not found" UI
  //    before the first fetch actually begins.
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data = await featuredRequestService.getMyRequestDetail(id);
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
      // ✅ Clear any stale detail so the error UI can render
      setDetail(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDetail(null);
    setLoading(true); // ✅ back to "loading" state for the next open
  }, []);

  return {
    detail,
    loading,
    fetchDetail,
    reset,
  };
};

export default useUserFeaturedRequestDetail;