import { useState, useCallback } from 'react';
import { ratingService } from '../services/ratingService';
import { toast } from 'react-toastify';
import type {
  ReviewStatusResponse,
  CreateRatingPayload,
  UpdateRatingPayload,
} from '../types';

/**
 * Hook for managing a single review on an announcement.
 *
 * Used in: AnnouncementReviewSection (on AnnouncementDetailsPage)
 *
 * Handles:
 * - Fetch review status (can_review / already_reviewed / own_announcement)
 * - Create / Update / Delete rating
 * - Auto-refetch after mutations
 */
export const useAnnouncementReview = () => {
  const [status, setStatus] = useState<ReviewStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch review status for an announcement
   */
  const fetchStatus = useCallback(async (announcementId: number) => {
    try {
      setLoading(true);
      const data = await ratingService.getReviewStatus(announcementId);
      setStatus(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل حالة التقييم';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new rating → refetches status
   */
  const createRating = useCallback(
    async (payload: CreateRatingPayload, announcementId: number) => {
      try {
        setSubmitting(true);
        const response = await ratingService.createRating(payload);
        toast.success(response.message || 'تم إضافة التقييم بنجاح');
        await fetchStatus(announcementId);
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          toast.error(message || 'لقد قمت بتقييم هذا المستخدم مسبقاً');
          // Refresh to sync the UI
          try {
            await fetchStatus(announcementId);
          } catch {
            /* silent */
          }
        } else {
          toast.error(message || 'حدث خطأ في إضافة التقييم');
        }
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchStatus]
  );

  /**
   * Update a rating → refetches status
   */
  const updateRating = useCallback(
    async (ratingId: number, payload: UpdateRatingPayload, announcementId: number) => {
      try {
        setSubmitting(true);
        const response = await ratingService.updateRating(ratingId, payload);
        toast.success(response.message || 'تم تحديث التقييم بنجاح');
        await fetchStatus(announcementId);
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 403) {
          toast.error(message || 'لا يمكن تعديل التقييم بعد 24 ساعة');
        } else {
          toast.error(message || 'حدث خطأ في تحديث التقييم');
        }
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchStatus]
  );

  /**
   * Delete a rating → refetches status
   */
  const deleteRating = useCallback(
    async (ratingId: number, announcementId: number) => {
      try {
        setSubmitting(true);
        const response = await ratingService.deleteRating(ratingId);
        toast.success(response.message || 'تم حذف التقييم بنجاح');
        await fetchStatus(announcementId);
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
      } finally {
        setSubmitting(false);
      }
    },
    [fetchStatus]
  );

  return {
    status,
    loading,
    submitting,
    fetchStatus,
    createRating,
    updateRating,
    deleteRating,
  };
};

export default useAnnouncementReview;