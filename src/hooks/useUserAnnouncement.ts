import { useState, useCallback } from 'react';
import { userAnnouncementService } from '../services/userAnnouncementService';
import { toast } from 'react-toastify';
import type { UserAnnouncementDetailResponse } from '../types';

/**
 * Hook for managing a single user announcement (Owner view).
 *
 * Used in: MyAnnouncementDetailsPage, EditAnnouncementPage
 *
 * Provides:
 * - fetchAnnouncement (single)
 * - completeAnnouncement (mark as done)
 * - reopenAnnouncement (undo completion)
 * - announcement, loading
 */
export const useUserAnnouncement = () => {
  const [announcement, setAnnouncement] =
    useState<UserAnnouncementDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Fetch single announcement (Owner view)
   * GET /api/v1/user/announcements/{id}
   */
  const fetchAnnouncement = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const data = await userAnnouncementService.getAnnouncement(id);
      setAnnouncement(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في التحميل';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Complete announcement (mark as done)
   * POST /api/v1/user/announcements/{id}/complete
   *
   * Updates local state with the returned announcement.
   */
  const completeAnnouncement = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const response =
        await userAnnouncementService.completeAnnouncement(id);
      // Backend returns the updated announcement
      setAnnouncement(response);
      toast.success('🎉 تم الإكمال بنجاح');
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ أثناء الإكمال';
      toast.error(message);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * Reopen a completed announcement
   * POST /api/v1/user/announcements/{id}/reopen
   *
   * Updates local state with the returned announcement.
   */
  const reopenAnnouncement = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const response = await userAnnouncementService.reopenAnnouncement(id);
      setAnnouncement(response);
      toast.success('تم إعادة الفتح بنجاح');
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ أثناء إعادة الفتح';
      toast.error(message);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    announcement,
    loading,
    actionLoading,
    fetchAnnouncement,
    completeAnnouncement,
    reopenAnnouncement,
  };
};

export default useUserAnnouncement;