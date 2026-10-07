import { useState, useCallback } from 'react';
import { donationAchievementService } from '../services/donationAchievementService';
import { toast } from 'react-toastify';
import type {
  DonationAchievement,
  DonationAchievementsResponse,
} from '../types';

/**
 * Public Donation Achievements.
 * Used in: BasmaFundPage (carousel), AchievementsPage (list + filters)
 *
 * ✅ fetchList now supports server-side search + sort:
 *      fetchList({ page, per_page, search, sort })
 */
export const useDonationAchievements = () => {
  const [achievements, setAchievements] = useState<DonationAchievement[]>([]);
  const [featured, setFeatured] = useState<DonationAchievement[]>([]);
  const [meta, setMeta] = useState<DonationAchievementsResponse['meta'] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  const fetchList = useCallback(
    async (params?: {
      page?: number;
      per_page?: number;
      search?: string;
      sort?: 'newest' | 'oldest' | 'order';
    }) => {
      try {
        setLoading(true);
        const response = await donationAchievementService.getList(params);
        setAchievements(response.data);
        setMeta(response.meta);
        return response;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'حدث خطأ في تحميل الإنجازات'
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchFeatured = useCallback(async () => {
    try {
      setFeaturedLoading(true);
      const response = await donationAchievementService.getFeatured();
      setFeatured(response.data);
      return response.data;
    } catch (error: any) {
      // Silent — carousel just hides on empty
      console.warn('Failed to load featured achievements:', error);
      setFeatured([]);
      return [];
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (id: number) => {
    try {
      const response = await donationAchievementService.getDetail(id);
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'حدث خطأ في تحميل الإنجاز'
      );
      throw error;
    }
  }, []);

  return {
    achievements,
    featured,
    meta,
    loading,
    featuredLoading,
    fetchList,
    fetchFeatured,
    fetchDetail,
  };
};

export default useDonationAchievements;