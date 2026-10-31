import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCommunityInfiniteScrollOptions {
  /** Fetch function that receives page number */
  fetchPage: (page: number, signal?: AbortSignal) => Promise<void>;
  /** Initial page number */
  initialPage?: number;
  /** IntersectionObserver rootMargin */
  rootMargin?: string;
  /** Enable/disable the observer */
  enabled?: boolean;
}

interface UseCommunityInfiniteScrollReturn {
  /** Attach to sentinel div at bottom of the list */
  sentinelRef: (node: HTMLElement | null) => void;
  /** Current page number */
  currentPage: number;
  /** Manually trigger load more (for the fallback button) */
  loadMore: () => void;
  /** Manually reset page back to initial */
  reset: () => void;
  /** Is a fetch currently in progress */
  isLoading: boolean;
  /** Set loading state externally (e.g. from a fetch hook) */
  setIsLoading: (value: boolean) => void;
  /** Abort the currently in-flight request */
  abort: () => void;
}

/**
 * Manages pagination state for an infinite-scroll list with a
 * "Load More" fallback button.
 *
 * - Uses IntersectionObserver to auto-load when sentinel is visible.
 * - Exposes `loadMore()` for a manual button (used when observer fails).
 * - Handles abort on unmount / manual reset.
 * - Auto-disables observer when `enabled = false` (e.g. no more pages).
 */
export const useCommunityInfiniteScroll = (
  options: UseCommunityInfiniteScrollOptions
): UseCommunityInfiniteScrollReturn => {
  const {
    fetchPage,
    initialPage = 1,
    rootMargin = '300px',
    enabled = true,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  // Refs to avoid re-creating observer on every render
  const sentinelNodeRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ------------------------------------------------------------
  // Internal fetch — wrapped to set loading state + handle abort
  // ------------------------------------------------------------
  const runFetch = useCallback(
    async (page: number) => {
      if (isLoading) return;

      // Cancel any previous in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      try {
        await fetchPage(page, controller.signal);
      } finally {
        // Only clear loading if this is still the active controller
        if (abortRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [fetchPage, isLoading]
  );

  // ------------------------------------------------------------
  // Manual loadMore (for the fallback button)
  // ------------------------------------------------------------
  const loadMore = useCallback(() => {
    if (isLoading) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    runFetch(nextPage);
  }, [currentPage, isLoading, runFetch]);

  // ------------------------------------------------------------
  // Reset (used when filters change)
  // ------------------------------------------------------------
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setCurrentPage(initialPage);
    setIsLoading(false);
  }, [initialPage]);

  // ------------------------------------------------------------
  // Abort helper exposed to the caller
  // ------------------------------------------------------------
  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  // ------------------------------------------------------------
  // Sentinel ref + observer
  // ------------------------------------------------------------
  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      sentinelNodeRef.current = node;

      // Cleanup old observer
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting && !isLoading) {
            loadMore();
          }
        },
        { rootMargin }
      );

      observerRef.current.observe(node);
    },
    [enabled, isLoading, loadMore, rootMargin]
  );

  // ------------------------------------------------------------
  // Cleanup on unmount
  // ------------------------------------------------------------
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      abortRef.current?.abort();
    };
  }, []);

  return {
    sentinelRef,
    currentPage,
    loadMore,
    reset,
    isLoading,
    setIsLoading,
    abort,
  };
};

export default useCommunityInfiniteScroll;