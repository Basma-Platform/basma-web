import { useState, useCallback } from 'react';
import { adminDonationAchievementService } from '../services/adminDonationAchievementService';
import { toast } from 'react-toastify';
import {
  translateBackendMessage,
} from '../utils/helpRequestErrorMessages';
import type {
  DonationAchievement,
  DonationAchievementsResponse,
  AdminDonationAchievementPayload,
  AdminDonationAchievementsStats,
} from '../types';

type PaginationMeta = DonationAchievementsResponse['meta'];

const EMPTY_STATS: AdminDonationAchievementsStats = {
  total: 0,
  active: 0,
  inactive: 0,
  featured: 0,
};

export const useAdminDonationAchievements = () => {
  const [achievements, setAchievements] = useState<DonationAchievement[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<AdminDonationAchievementsStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // List
  // ============================================
  const fetchList = useCallback(
    async (params?: {
      is_active?: boolean;
      is_featured?: boolean;
      search?: string;
      sort?: 'newest' | 'oldest' | 'order' | 'date_desc';
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await adminDonationAchievementService.getList(params);
        setAchievements(response.data);
        setMeta(response.meta);
        return response;
      } catch (error: any) {
        const message = translateBackendMessage(
          error.response?.data?.message,
          error.response?.data?.message
        );
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // Stats  🆕
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await adminDonationAchievementService.getStats();
      setStats(data);
      return data;
    } catch (error: any) {
      // Silent — stats are non-critical
      console.warn('Failed to load achievement stats:', error);
      return null;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ============================================
  // Create
  // ============================================
  const create = useCallback(
    async (payload: AdminDonationAchievementPayload) => {
      try {
        setActionLoading(true);
        const response = await adminDonationAchievementService.create(payload);

        toast.success(
          translateBackendMessage(response.message, response.message) ||
            'تم إنشاء الإنجاز بنجاح'
        );

        setAchievements((prev) => [response.data, ...prev]);
        setMeta((prev) =>
          prev ? { ...prev, total: prev.total + 1 } : prev
        );

        // ✅ Optimistic stats update
        setStats((prev) => ({
          total: prev.total + 1,
          active: prev.active + (response.data.is_active ? 1 : 0),
          inactive: prev.inactive + (response.data.is_active ? 0 : 1),
          featured: prev.featured + (response.data.is_featured ? 1 : 0),
        }));

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 422) {
          toast.error(translateBackendMessage(message, message));
        } else {
          toast.error(translateBackendMessage(message, message));
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // Update
  // ============================================
  const update = useCallback(
    async (id: number, payload: AdminDonationAchievementPayload) => {
      try {
        setActionLoading(true);
        const response = await adminDonationAchievementService.update(
          id,
          payload
        );

        toast.success(
          translateBackendMessage(response.message, response.message) ||
            'تم تحديث الإنجاز بنجاح'
        );

        // ── Detect what changed for optimistic stats ──
        const old = achievements.find((a) => a.id === id);
        const wasActive = old?.is_active ?? false;
        const wasFeatured = old?.is_featured ?? false;
        const nowActive = response.data.is_active;
        const nowFeatured = response.data.is_featured;

        setAchievements((prev) =>
          prev.map((a) => (a.id === id ? response.data : a))
        );

        if (old && (wasActive !== nowActive || wasFeatured !== nowFeatured)) {
          setStats((prev) => ({
            ...prev,
            active: prev.active + (nowActive ? 1 : 0) - (wasActive ? 1 : 0),
            inactive:
              prev.inactive + (nowActive ? 0 : 1) - (wasActive ? 0 : 1),
            featured:
              prev.featured + (nowFeatured ? 1 : 0) - (wasFeatured ? 1 : 0),
          }));
        }

        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 404) {
          toast.error(
            translateBackendMessage(message, message) || 'الإنجاز غير موجود'
          );
        } else if (status === 422) {
          toast.error(translateBackendMessage(message, message));
        } else {
          toast.error(translateBackendMessage(message, message));
        }
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [achievements]
  );

  // ============================================
  // Delete
  // ============================================
  const deleteAchievement = useCallback(
    async (id: number, reason?: string) => {
      try {
        setActionLoading(true);

        const removed = achievements.find((a) => a.id === id);

        const response = await adminDonationAchievementService.delete(id, reason);

        toast.success(
          translateBackendMessage(response.message, response.message) ||
            'تم حذف الإنجاز بنجاح'
        );

        setAchievements((prev) => prev.filter((a) => a.id !== id));
        setMeta((prev) =>
          prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
        );

        // ✅ Optimistic stats update
        if (removed) {
          setStats((prev) => ({
            total: Math.max(0, prev.total - 1),
            active: Math.max(0, prev.active - (removed.is_active ? 1 : 0)),
            inactive: Math.max(0, prev.inactive - (removed.is_active ? 0 : 1)),
            featured: Math.max(0, prev.featured - (removed.is_featured ? 1 : 0)),
          }));
        } else {
          setStats((prev) => ({
            ...prev,
            total: Math.max(0, prev.total - 1),
          }));
        }

        return response;
      } catch (error: any) {
        const message = error.response?.data?.message;
        toast.error(translateBackendMessage(message, message));
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [achievements]
  );

  // ============================================
  // Toggle Featured
  // ✅ Backend now returns full `data`
  // ============================================
  const toggleFeatured = useCallback(async (id: number) => {
    try {
      setActionLoading(true);

      const old = achievements.find((a) => a.id === id);

      const response = await adminDonationAchievementService.toggleFeatured(id);

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم تحديث حالة التمييز'
      );

      // ✅ Use response.data (full Resource)
      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? response.data : a))
      );

      // ✅ Optimistic stats
      if (old) {
        const wasFeatured = old.is_featured;
        const nowFeatured = response.data.is_featured;

        if (wasFeatured !== nowFeatured) {
          setStats((prev) => ({
            ...prev,
            featured: prev.featured + (nowFeatured ? 1 : -1),
          }));
        }
      }

      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 422) {
        toast.error(translateBackendMessage(message, message));
      } else {
        toast.error(translateBackendMessage(message, message));
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [achievements]);

  // ============================================
  // Toggle Active
  // ✅ Backend now returns full `data`
  // ============================================
  const toggleActive = useCallback(async (id: number) => {
    try {
      setActionLoading(true);

      const old = achievements.find((a) => a.id === id);

      const response = await adminDonationAchievementService.toggleActive(id);

      toast.success(
        translateBackendMessage(response.message, response.message) ||
          'تم تحديث حالة الإنجاز'
      );

      setAchievements((prev) =>
        prev.map((a) => (a.id === id ? response.data : a))
      );

      // ✅ Optimistic stats
      if (old) {
        const wasActive = old.is_active;
        const nowActive = response.data.is_active;

        if (wasActive !== nowActive) {
          setStats((prev) => ({
            ...prev,
            active: prev.active + (nowActive ? 1 : -1),
            inactive: prev.inactive + (nowActive ? -1 : 1),
          }));
        }
      }

      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 422) {
        toast.error(translateBackendMessage(message, message));
      } else {
        toast.error(translateBackendMessage(message, message));
      }
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [achievements]);

  return {
    achievements,
    meta,
    stats,
    loading,
    statsLoading,
    actionLoading,
    fetchList,
    fetchStats,
    create,
    update,
    deleteAchievement,
    toggleFeatured,
    toggleActive,
  };
};

export default useAdminDonationAchievements;