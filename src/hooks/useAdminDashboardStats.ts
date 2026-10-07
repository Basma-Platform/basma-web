import { useState, useCallback } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';
import { toast } from 'react-toastify';
import type {
  AdminDashboardStats,
  AdminDashboardPending,
  AdminDashboardTop,
  AdminDashboardAdvanced,
} from '../types';

/**
 * Focused hook for Stats, Pending, Top, and Advanced
 * Used when you need to fetch a SPECIFIC section independently
 */
export const useAdminDashboardStats = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [pending, setPending] = useState<AdminDashboardPending | null>(null);
  const [top, setTop] = useState<AdminDashboardTop | null>(null);
  const [advanced, setAdvanced] = useState<AdminDashboardAdvanced | null>(null);

  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingAdvanced, setLoadingAdvanced] = useState(false);

  /**
   * Fetch overview stats
   * GET /api/v1/admin/dashboard/stats
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const response = await adminDashboardService.getStats();
      setStats(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'حدث خطأ في تحميل الإحصائيات';
      toast.error(message);
      throw err;
    } finally {
      setLoadingStats(false);
    }
  }, []);

  /**
   * Fetch pending items
   * GET /api/v1/admin/dashboard/pending
   */
  const fetchPending = useCallback(async () => {
    try {
      setLoadingPending(true);
      const response = await adminDashboardService.getPending();
      setPending(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'حدث خطأ في تحميل العناصر المعلقة';
      toast.error(message);
      throw err;
    } finally {
      setLoadingPending(false);
    }
  }, []);

  /**
   * Fetch top performers
   * GET /api/v1/admin/dashboard/top
   */
  const fetchTop = useCallback(async () => {
    try {
      setLoadingTop(true);
      const response = await adminDashboardService.getTop();
      setTop(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'حدث خطأ في تحميل الأفضل أداءً';
      toast.error(message);
      throw err;
    } finally {
      setLoadingTop(false);
    }
  }, []);

  /**
   * Fetch advanced stats
   * GET /api/v1/admin/dashboard/advanced
   */
  const fetchAdvanced = useCallback(async () => {
    try {
      setLoadingAdvanced(true);
      const response = await adminDashboardService.getAdvanced();
      setAdvanced(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'حدث خطأ في تحميل الإحصائيات المتقدمة';
      toast.error(message);
      throw err;
    } finally {
      setLoadingAdvanced(false);
    }
  }, []);

  return {
    // Data
    stats,
    pending,
    top,
    advanced,

    // Loading
    loadingStats,
    loadingPending,
    loadingTop,
    loadingAdvanced,

    // Actions
    fetchStats,
    fetchPending,
    fetchTop,
    fetchAdvanced,
  };
};

export default useAdminDashboardStats;