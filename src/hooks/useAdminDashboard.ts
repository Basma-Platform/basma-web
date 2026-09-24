import { useState, useCallback, useRef, useEffect } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';
import { toast } from 'react-toastify';
import type { AdminDashboardResponse } from '../types';

/**
 * Main hook for Admin Dashboard
 *
 * Responsibilities:
 * - Fetch all-in-one dashboard data (initial load)
 * - Refresh stats periodically (respect cache_ttl)
 * - Refresh pending items periodically
 * - Manage refresh interval based on cache_ttl from meta
 *
 * Used in: pages/dashboard/AdminDashboard.tsx
 */
export const useAdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardResponse['data'] | null>(null);
  const [meta, setMeta] = useState<AdminDashboardResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Initial load — everything at once
   * GET /api/v1/admin/dashboard
   */
  const fetchDashboard = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminDashboardService.getMainDashboard();

      if (!isMountedRef.current) return;

      setData(response.data);
      setMeta(response.meta);

      if (showToast) {
        toast.success('تم تحديث البيانات بنجاح');
      }

      return response;
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const message =
        err.response?.data?.message || 'حدث خطأ في تحميل لوحة التحكم';
      setError(message);

      if (err.response?.status !== 401 && err.response?.status !== 403) {
        toast.error(message);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  /**
   * Refresh overview stats only
   * GET /api/v1/admin/dashboard/stats
   */
  const refreshStats = useCallback(async () => {
    try {
      const response = await adminDashboardService.getStats();
      if (!isMountedRef.current) return;

      setData((prev) =>
        prev ? { ...prev, overview: response.data } : prev
      );
    } catch (err) {
      // Silent fail — background refresh
      console.error('Failed to refresh stats:', err);
    }
  }, []);

  /**
   * Refresh pending items only
   * GET /api/v1/admin/dashboard/pending
   */
  const refreshPending = useCallback(async () => {
    try {
      const response = await adminDashboardService.getPending();
      if (!isMountedRef.current) return;

      setData((prev) =>
        prev ? { ...prev, pending: response.data } : prev
      );
    } catch (err) {
      console.error('Failed to refresh pending:', err);
    }
  }, []);

  /**
   * Refresh top performers only
   * GET /api/v1/admin/dashboard/top
   */
  const refreshTop = useCallback(async () => {
    try {
      const response = await adminDashboardService.getTop();
      if (!isMountedRef.current) return;

      setData((prev) => (prev ? { ...prev, top: response.data } : prev));
    } catch (err) {
      console.error('Failed to refresh top:', err);
    }
  }, []);

  /**
   * Manual refresh — reloads everything
   */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard(true);
  }, [fetchDashboard]);

  /**
   * Start auto-refresh for stats + pending
   * Uses cache_ttl from response meta (defaults to 60s)
   */
  const startAutoRefresh = useCallback(() => {
    if (statsIntervalRef.current) return;

    const interval = (meta?.cache_ttl || 60) * 1000;

    statsIntervalRef.current = setInterval(() => {
      refreshStats();
      refreshPending();
    }, interval);
  }, [meta?.cache_ttl, refreshStats, refreshPending]);

  /**
   * Stop auto-refresh
   */
  const stopAutoRefresh = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, []);

  /**
   * Auto-start refresh when data loaded, auto-stop on unmount
   */
  useEffect(() => {
    if (data && meta) {
      startAutoRefresh();
    }
    return () => {
      stopAutoRefresh();
    };
  }, [data, meta, startAutoRefresh, stopAutoRefresh]);

  return {
    // Data
    overview: data?.overview || null,
    pending: data?.pending || null,
    top: data?.top || null,
    recentActivity: data?.recent_activity || [],
    meta,

    // State
    loading,
    refreshing,
    error,

    // Actions
    fetchDashboard,
    refresh,
    refreshStats,
    refreshPending,
    refreshTop,
    startAutoRefresh,
    stopAutoRefresh,
  };
};

export default useAdminDashboard;