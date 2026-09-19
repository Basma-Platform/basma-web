import { useState, useCallback } from 'react';
import { ratingService } from '../services/ratingService';
import { toast } from 'react-toastify';
import type {
  Rating,
  MyRatingStats,
  MyReviewsListResponse,
} from '../types';

type PaginationMeta = MyReviewsListResponse['meta'];

/**
 * Hook for managing the current user's own reviews.
 *
 * Used in: MyReviewsPage (/user/my-reviews)
 *
 * Provides:
 * - Received list (paginated + optional rating filter)
 * - Given list (paginated)
 * - Stats (once)
 * - Delete a given rating (with optimistic UI)
 */
export const useMyReviews = () => {
  // Received
  const [received, setReceived] = useState<Rating[]>([]);
  const [receivedMeta, setReceivedMeta] = useState<PaginationMeta | null>(null);
  const [receivedLoading, setReceivedLoading] = useState(false);

  // Given
  const [given, setGiven] = useState<Rating[]>([]);
  const [givenMeta, setGivenMeta] = useState<PaginationMeta | null>(null);
  const [givenLoading, setGivenLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<MyRatingStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ============================================
  // Received
  // ============================================
  const fetchReceived = useCallback(
    async (params?: {
      rating?: 1 | 2 | 3 | 4 | 5;
      page?: number;
      per_page?: number;
    }) => {
      try {
        setReceivedLoading(true);
        const response = await ratingService.getMyReceived(params);
        setReceived(response.data);
        setReceivedMeta(response.meta);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'حدث خطأ في تحميل التقييمات المستلمة';
        toast.error(message);
        throw error;
      } finally {
        setReceivedLoading(false);
      }
    },
    []
  );

  // ============================================
  // Given
  // ============================================
  const fetchGiven = useCallback(
    async (params?: { page?: number; per_page?: number }) => {
      try {
        setGivenLoading(true);
        const response = await ratingService.getMyGiven(params);
        setGiven(response.data);
        setGivenMeta(response.meta);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'حدث خطأ في تحميل التقييمات المعطاة';
        toast.error(message);
        throw error;
      } finally {
        setGivenLoading(false);
      }
    },
    []
  );

  // ============================================
  // Stats
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await ratingService.getMyStats();
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
  // Delete (given only)
  // ============================================
  const deleteGivenRating = useCallback(async (ratingId: number) => {
    try {
      const response = await ratingService.deleteRating(ratingId);
      // Optimistic update
      setGiven((prev) => prev.filter((r) => r.id !== ratingId));
      // Adjust stats optimistically
      setStats((prev) =>
        prev
          ? {
              ...prev,
              total_given: Math.max(0, prev.total_given - 1),
            }
          : prev
      );
      toast.success(response.message || 'تم حذف التقييم بنجاح');
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 403) {
        toast.error(message || 'لا يمكن حذف التقييم بعد 24 ساعة');
      } else {
        toast.error(message || 'حدث خطأ في حذف التقييم');
      }
      throw error;
    }
  }, []);

  return {
    // Received
    received,
    receivedMeta,
    receivedLoading,
    fetchReceived,

    // Given
    given,
    givenMeta,
    givenLoading,
    fetchGiven,

    // Stats
    stats,
    statsLoading,
    fetchStats,

    // Actions
    deleteGivenRating,
  };
};

export default useMyReviews;