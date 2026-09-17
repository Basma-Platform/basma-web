import { useState, useCallback } from 'react';
import { userAnnouncementService } from '../services/userAnnouncementService';
import { toast } from 'react-toastify';
import type {
  UserAnnouncementsResponse,
  UserAnnouncementStats,
  Announcement,
} from '../types';

/**
 * Hook for managing user's announcements list
 * Used in: MyAnnouncementsPage
 */
export const useUserAnnouncements = () => {
  const [data, setData] = useState<Announcement[]>([]);
  const [meta, setMeta] = useState<UserAnnouncementsResponse['meta'] | null>(
    null
  );
  const [stats, setStats] = useState<UserAnnouncementStats | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch my announcements
   * GET /api/v1/user/announcements
   */
  const fetchMyAnnouncements = useCallback(
    async (params?: {
      status?: 'all' | 'active' | 'disabled' | 'featured';
      search?: string;
      sort?: 'newest' | 'oldest' | 'most_viewed';
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await userAnnouncementService.getMyAnnouncements(
          params
        );
        setData(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل الإعلانات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Delete announcement (soft delete)
   * DELETE /api/v1/user/announcements/{id}
   */
  const deleteAnnouncement = useCallback(async (id: number) => {
    try {
      const response = await userAnnouncementService.deleteAnnouncement(id);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ في الحذف';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Disable announcement
   * POST /api/v1/user/announcements/{id}/disable
   */
  const disableAnnouncement = useCallback(
    async (id: number, reason?: string) => {
      try {
        const response = await userAnnouncementService.disableAnnouncement(
          id,
          reason
        );
        toast.success(response.message);
        return response;
      } catch (error: any) {
        const message = error.response?.data?.message || 'حدث خطأ في التعطيل';
        toast.error(message);
        throw error;
      }
    },
    []
  );

  /**
   * Enable announcement
   * POST /api/v1/user/announcements/{id}/enable
   * Note: Returns UserAnnouncementDetailResponse (no message field)
   */
  const enableAnnouncement = useCallback(async (id: number) => {
    try {
      const response = await userAnnouncementService.enableAnnouncement(id);
      // ✅ Fixed: use hardcoded success message (API response has no `message`)
      toast.success('تم تفعيل الإعلان بنجاح');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'حدث خطأ في التفعيل';
      toast.error(message);
      throw error;
    }
  }, []);

  return {
    data,
    meta,
    stats,
    loading,
    fetchMyAnnouncements,
    deleteAnnouncement,
    disableAnnouncement,
    enableAnnouncement,
  };
};

export default useUserAnnouncements;