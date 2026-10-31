import { useState, useCallback, useEffect, useRef } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import type {
  AdminCommunityPostListItem,
  AdminCommunityStats,
  CommunityAdminFilters,
  CommunityPostsAdminResponse,
} from '../types';

/**
 * Admin Community Posts list + stats.
 *
 * Used in: AdminCommunityPostsPage
 */
export const useAdminCommunityPosts = () => {
  const [posts, setPosts] = useState<AdminCommunityPostListItem[]>([]);
  const [meta, setMeta] = useState<CommunityPostsAdminResponse['meta'] | null>(
    null
  );
  const [stats, setStats] = useState<AdminCommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================
  // Fetch list (with filters)
  // ============================================
  const fetchPosts = useCallback(
    async (filters: CommunityAdminFilters = {}) => {
      try {
        setLoading(true);
        const response = await communityService.adminGetPosts({
          per_page: 20,
          page: 1,
          ...filters,
        });
        if (!isMountedRef.current) return;

        setPosts(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (err: any) {
        if (!isMountedRef.current) return;
        const message =
          err.response?.data?.message || 'حدث خطأ في تحميل المنشورات';
        toast.error(message);
        throw err;
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Fetch stats only (lightweight refresh)
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await communityService.adminGetStats();
      if (!isMountedRef.current) return;

      setStats(data);
      return data;
    } catch (err: any) {
      // Silent — stats aren't critical
      console.warn('Failed to load admin community stats:', err);
      return null;
    } finally {
      if (isMountedRef.current) setStatsLoading(false);
    }
  }, []);

  // ============================================
  // Update one post in list (after approve/reject/pin)
  // ============================================
  const updatePostInList = useCallback(
    (updated: Partial<AdminCommunityPostListItem> & { id: number }) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
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

  return {
    posts,
    meta,
    stats,
    loading,
    statsLoading,
    fetchPosts,
    fetchStats,
    updatePostInList,
    removePost,
  };
};

export default useAdminCommunityPosts;