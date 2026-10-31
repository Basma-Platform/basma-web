import { useState, useCallback, useRef } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import type { CommunityPost } from '../types';

/**
 * Single Community Post detail + WhatsApp click tracking.
 *
 * VIEW COUNTING NOTE:
 * The backend `show()` endpoint increments `views` with a 30-minute
 * cache per IP. This means opening the same post twice within 30
 * minutes will NOT increment the count on the server. This is
 * intentional (anti-spam). To see views increment, use different
 * IPs or wait 30 minutes between opens.
 */
export const useCommunityPostDetails = () => {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);

  // Track which post IDs we've already fetched this session,
  // so we don't re-fetch the same post on rapid modal reopen.
  const fetchedIdsRef = useRef<Set<number>>(new Set());

  const fetchPost = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data = await communityService.getPost(id);
      setPost(data);
      fetchedIdsRef.current.add(id);
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(message || 'المنشور غير موجود أو غير منشور');
      } else {
        toast.error(message || 'حدث خطأ في تحميل المنشور');
      }
      setPost(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackWhatsappClick = useCallback(
    async (postId: number, whatsappNumber: string): Promise<string | null> => {
      if (!whatsappNumber) return null;

      try {
        setTracking(true);

        communityService.trackWhatsappClick(postId).catch(() => {
          /* silent */
        });

        setPost((prev) =>
          prev
            ? { ...prev, whatsapp_clicks: prev.whatsapp_clicks + 1 }
            : prev
        );

        const clean = whatsappNumber.replace(/[^\d]/g, '');
        return `https://wa.me/${clean}`;
      } finally {
        setTracking(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setPost(null);
    setLoading(false);
    setTracking(false);
  }, []);

  return {
    post,
    loading,
    tracking,
    fetchPost,
    trackWhatsappClick,
    reset,
  };
};

export default useCommunityPostDetails;