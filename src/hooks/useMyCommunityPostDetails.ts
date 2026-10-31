import { useState, useCallback } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import { translateBackendMessage } from '../utils/helpRequestErrorMessages';
import type { UserCommunityPost } from '../types';

/**
 * My Community Post detail (owner view) + resolve action.
 *
 * Used in:
 *  - MyCommunityPostDetailsPage
 *  - EditCommunityPostPage (initial fetch)
 */
export const useMyCommunityPostDetails = () => {
  const [post, setPost] = useState<UserCommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // Fetch
  // ============================================
  const fetchPost = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data = await communityService.getMyPost(id);
      setPost(data);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(message || 'المنشور غير موجود أو لا تملك صلاحية الوصول');
      } else {
        toast.error(message || 'حدث خطأ في تحميل المنشور');
      }
      setPost(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Resolve
  // ============================================
  const resolvePost = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const response = await communityService.resolvePost(id);

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم وسم المنشور كمحلول'
      );

      setPost(response.data);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(
          translateBackendMessage(message, message) ||
            'لا يمكن وضع "تم الحل" على هذا المنشور'
        );
      } else if (status === 404) {
        toast.error(message || 'المنشور غير موجود');
      } else {
        toast.error(message || 'حدث خطأ أثناء وضع علامة "تم الحل"');
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
    setPost(null);
    setLoading(true);
  }, []);

  return {
    post,
    loading,
    actionLoading,
    fetchPost,
    resolvePost,
    reset,
  };
};

export default useMyCommunityPostDetails;