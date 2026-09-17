import { useState, useCallback } from 'react';
import { userAnnouncementService } from '../services/userAnnouncementService';
import { toast } from 'react-toastify';
import type { UserAnnouncementDetailResponse } from '../types';

/**
 * Hook for managing a single user announcement (Owner view)
 *
 * Used in: MyAnnouncementDetailsPage, EditAnnouncementPage
 *
 * Provides:
 * - fetchAnnouncement (single)
 * - announcement, loading
 */
export const useUserAnnouncement = () => {
  const [announcement, setAnnouncement] =
    useState<UserAnnouncementDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
        error.response?.data?.message || 'حدث خطأ في تحميل الإعلان';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    announcement,
    loading,
    fetchAnnouncement,
  };
};

export default useUserAnnouncement;