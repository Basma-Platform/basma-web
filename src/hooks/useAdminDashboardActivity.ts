import { useState, useCallback, useRef, useEffect } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';
import { toast } from 'react-toastify';
import type {
  AdminActivityItem,
  AdminActivityResponse,
  AdminActivityFilters,
} from '../types';

const LIVE_POLLING_INTERVAL = 30000; // 30 seconds

/**
 * Hook for Activity Feed
 *
 * Features:
 * - Paginated fetch with filters
 * - Live polling (30s) — latest 20 events
 * - Manual refresh
 * - Auto-cleanup on unmount
 *
 * Used in: ActivityFeed component
 */
export const useAdminDashboardActivity = () => {
  const [activities, setActivities] = useState<AdminActivityItem[]>([]);
  const [meta, setMeta] = useState<AdminActivityResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  /**
   * Fetch paginated activity with filters
   * GET /api/v1/admin/dashboard/activity
   */
  const fetchActivity = useCallback(
    async (filters: AdminActivityFilters = {}) => {
      try {
        setLoading(true);
        const response = await adminDashboardService.getActivity(filters);

        if (!isMountedRef.current) return;

        setActivities(response.data);
        setMeta(response.meta);
        return response;
      } catch (err: any) {
        if (!isMountedRef.current) return;

        const message =
          err.response?.data?.message || 'حدث خطأ في تحميل النشاطات';
        toast.error(message);
        throw err;
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch live activity — latest 20, no pagination
   * GET /api/v1/admin/dashboard/activity/live
   */
  const fetchLive = useCallback(async (silent = true) => {
    try {
      const response = await adminDashboardService.getActivityLive();
      if (!isMountedRef.current) return;

      setActivities(response.data);
      return response.data;
    } catch (err) {
      if (!silent) {
        toast.error('حدث خطأ في تحديث النشاطات');
      }
      console.error('Failed to fetch live activity:', err);
    }
  }, []);

  /**
   * Start polling for live activity (30s)
   */
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;

    setPolling(true);
    pollingRef.current = setInterval(() => {
      fetchLive(true);
    }, LIVE_POLLING_INTERVAL);
  }, [fetchLive]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPolling(false);
  }, []);

  /**
   * Manual refresh — fetch live immediately
   */
  const refresh = useCallback(async () => {
    await fetchLive(false);
  }, [fetchLive]);

  return {
    // Data
    activities,
    meta,

    // State
    loading,
    polling,

    // Actions
    fetchActivity,
    fetchLive,
    startPolling,
    stopPolling,
    refresh,
  };
};

export default useAdminDashboardActivity;