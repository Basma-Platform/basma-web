import { useState, useCallback, useEffect, useRef } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import type {
  UserCommunityPost,
  CommunityUserFilters,
  CommunityPostsUserResponse,
} from '../types';

/**
 * My Community Posts list (owner view).
 *
 * - Filters by status + type
 * - Standard pagination (not infinite — user lists are usually small)
 *
 * Used in: MyCommunityPostsPage
 */
export const useMyCommunityPosts = () => {
  const [posts, setPosts] = useState<UserCommunityPost[]>([]);
  const [meta, setMeta] = useState<CommunityPostsUserResponse['meta'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================
  // Fetch
  // ============================================
  const fetchMyPosts = useCallback(
    async (filters: CommunityUserFilters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await communityService.getMyPosts({
          per_page: 12,
          page: 1,
          ...filters,
        });
        if (!isMountedRef.current) return;

        setPosts(response.data);
        setMeta(response.meta);
        return response;
      } catch (err: any) {
        if (!isMountedRef.current) return;

        const message =
          err.response?.data?.message || 'حدث خطأ في تحميل منشوراتك';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Remove from list (after delete)
  // ============================================
  const removePost = useCallback((id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setMeta((prev) =>
      prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
    );
  }, []);

  // ============================================
  // Update one in place (after resolve / edit)
  // ============================================
  const updatePost = useCallback((updated: UserCommunityPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  return {
    posts,
    meta,
    loading,
    error,
    fetchMyPosts,
    removePost,
    updatePost,
  };
};

export default useMyCommunityPosts;