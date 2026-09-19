import { useState, useCallback } from 'react';
import { ratingService } from '../services/ratingService';
import { toast } from 'react-toastify';
import type {
  Rating,
  AdminRatingStats,
  AdminRatingsListResponse,
} from '../types';

type PaginationMeta = AdminRatingsListResponse['meta'];

/**
 * Hook for managing admin ratings.
 *
 * Used in: AdminRatingsListPage (/admin/ratings)
 *
 * Provides:
 * - List with filters (search, rating value, sort, date range)
 * - Stats (total, avg, with-comments, distribution)
 * - Delete a rating (with optional reason + optimistic UI)
 */
export const useAdminRatings = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<AdminRatingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // Fetch list
  // ============================================
  const fetchRatings = useCallback(
    async (params?: {
      search?: string;
      rating?: 1 | 2 | 3 | 4 | 5;
      sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
      from_date?: string;
      to_date?: string;
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await ratingService.adminGetRatings(params);
        setRatings(response.data);
        setMeta(response.meta);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل التقييمات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Fetch stats
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await ratingService.adminGetStats();
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
  // Delete rating — ✅ reason optional
  // ============================================
  const deleteRating = useCallback(
    async (ratingId: number, reason?: string) => {
      try {
        setActionLoading(true);
        const response = await ratingService.adminDeleteRating(
          ratingId,
          reason
        );

        // Optimistic remove
        setRatings((prev) => prev.filter((r) => r.id !== ratingId));
        setMeta((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
        );

        // Adjust stats optimistically
        setStats((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          updated.total_ratings = Math.max(0, updated.total_ratings - 1);

          const removedRating = ratings.find((r) => r.id === ratingId);
          if (removedRating) {
            const key = String(removedRating.rating) as
              | '1'
              | '2'
              | '3'
              | '4'
              | '5';
            updated.distribution = {
              ...updated.distribution,
              [key]: Math.max(0, (updated.distribution[key] || 0) - 1),
            };
            if (removedRating.comment) {
              updated.ratings_with_comments = Math.max(
                0,
                updated.ratings_with_comments - 1
              );
            }
          }
          return updated;
        });

        toast.success(response.message || 'تم حذف التقييم بنجاح');
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في حذف التقييم';
        toast.error(message);
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [ratings]
  );

  return {
    ratings,
    meta,
    stats,
    loading,
    statsLoading,
    actionLoading,
    fetchRatings,
    fetchStats,
    deleteRating,
  };
};

export default useAdminRatings;