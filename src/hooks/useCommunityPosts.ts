import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import type {
  CommunityPost,
  CommunityPublicFilters,
  CommunityPostsPublicResponse,
} from '../types';

interface UseCommunityPostsOptions {
  perPage?: number;
}

/**
 * Public Community Posts feed.
 *
 * - URL-synced filters (type, governorate, city, category, search)
 * - Infinite scroll with page tracking
 * - Reset + refetch on filter change
 *
 * Used in: CommunityPage
 */
export const useCommunityPosts = (
  options: UseCommunityPostsOptions = {}
) => {
  const { perPage = 12 } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [meta, setMeta] = useState<CommunityPostsPublicResponse['meta'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which page we're on — separate from filter changes
  const pageRef = useRef(1);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================
  // Read filters from URL
  // ============================================
  const filters: CommunityPublicFilters = {
    type: (searchParams.get('type') as any) || undefined,
    category_id: searchParams.get('category_id')
      ? Number(searchParams.get('category_id'))
      : undefined,
    governorate_id: searchParams.get('governorate_id')
      ? Number(searchParams.get('governorate_id'))
      : undefined,
    city_id: searchParams.get('city_id')
      ? Number(searchParams.get('city_id'))
      : undefined,
    search: searchParams.get('search') || undefined,
  };

  // Serialize filters to detect changes
  const filtersKey = JSON.stringify(filters);

  // ============================================
  // Fetch page
  // ============================================
  const fetchPage = useCallback(
    async (page: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const response = await communityService.getPublicPosts({
          ...filters,
          page,
          per_page: perPage,
        });

        if (!isMountedRef.current) return;

        setPosts((prev) =>
          append ? [...prev, ...response.data] : response.data
        );
        setMeta(response.meta);
        setError(null);
      } catch (err: any) {
        if (!isMountedRef.current) return;
        const message =
          err.response?.data?.message || 'حدث خطأ في تحميل المنشورات';
        setError(message);
        if (!append) toast.error(message);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtersKey, perPage]
  );

  // ============================================
  // Refetch on filter change
  // ============================================
  useEffect(() => {
    pageRef.current = 1;
    fetchPage(1, false);
  }, [fetchPage]);

  // ============================================
  // Load more
  // ============================================
  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    if (!meta) return;
    if (pageRef.current >= meta.last_page) return;

    const next = pageRef.current + 1;
    pageRef.current = next;
    fetchPage(next, true);
  }, [loadingMore, loading, meta, fetchPage]);

  // ============================================
  // Refresh (manual)
  // ============================================
  const refresh = useCallback(() => {
    pageRef.current = 1;
    fetchPage(1, false);
  }, [fetchPage]);

  // ============================================
  // Filter setters (URL-synced)
  // ============================================
  const setFilter = useCallback(
    (key: keyof CommunityPublicFilters, value: any) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === undefined || value === null || value === '') {
            next.delete(key as string);
          } else {
            next.set(key as string, String(value));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters =
    !!filters.type ||
    !!filters.category_id ||
    !!filters.governorate_id ||
    !!filters.city_id ||
    !!filters.search;

  const hasMore = meta ? meta.current_page < meta.last_page : false;

  return {
    posts,
    meta,
    loading,
    loadingMore,
    error,

    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,

    hasMore,
    loadMore,
    refresh,
  };
};

export default useCommunityPosts;