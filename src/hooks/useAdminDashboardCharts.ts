import { useState, useCallback } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';
import { toast } from 'react-toastify';
import type {
  AdminDashboardCharts,
  ChartDaysRange,
  ChartTimeSeries,
  ChartSimple,
  ChartDualSeries,
} from '../types';

/**
 * Hook for Admin Dashboard Charts
 *
 * Features:
 * - Fetch all 8 charts at once (default)
 * - Fetch individual charts (lazy loading)
 * - Support days range parameter (7/14/30/60/90)
 *
 * Used in: ChartsGrid and individual Chart components
 */
export const useAdminDashboardCharts = () => {
  const [charts, setCharts] = useState<AdminDashboardCharts | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<ChartDaysRange>(30);

  // Individual chart states (for lazy loading)
  const [userGrowth, setUserGrowth] = useState<ChartTimeSeries | null>(null);
  const [announcementsCreated, setAnnouncementsCreated] =
    useState<ChartTimeSeries | null>(null);
  const [activityOverview, setActivityOverview] =
    useState<ChartTimeSeries | null>(null);
  const [announcementsByCategory, setAnnouncementsByCategory] =
    useState<ChartSimple | null>(null);
  const [announcementsByGovernorate, setAnnouncementsByGovernorate] =
    useState<ChartSimple | null>(null);
  const [reportsStatus, setReportsStatus] = useState<ChartSimple | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<ChartSimple | null>(null);
  const [paymentMethods, setPaymentMethods] =
    useState<ChartDualSeries | null>(null);

  /**
   * Fetch ALL charts at once
   * GET /api/v1/admin/dashboard/charts?days=30
   */
  const fetchAllCharts = useCallback(
    async (daysRange: ChartDaysRange = days) => {
      try {
        setLoading(true);
        setDays(daysRange);
        const response = await adminDashboardService.getCharts(daysRange);
        setCharts(response.data);
        return response.data;
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'حدث خطأ في تحميل الرسوم البيانية';
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [days]
  );

  // ============================================
  // INDIVIDUAL FETCHERS (for lazy loading)
  // ============================================

  const fetchUserGrowth = useCallback(
    async (daysRange: ChartDaysRange = days) => {
      try {
        const response = await adminDashboardService.getUserGrowthChart(
          daysRange
        );
        setUserGrowth(response.data);
        return response.data;
      } catch (err: any) {
        toast.error('حدث خطأ في تحميل الرسم البياني');
        throw err;
      }
    },
    [days]
  );

  const fetchAnnouncementsCreated = useCallback(
    async (daysRange: ChartDaysRange = days) => {
      try {
        const response = await adminDashboardService.getAnnouncementsCreatedChart(
          daysRange
        );
        setAnnouncementsCreated(response.data);
        return response.data;
      } catch (err: any) {
        toast.error('حدث خطأ في تحميل الرسم البياني');
        throw err;
      }
    },
    [days]
  );

  const fetchActivityOverview = useCallback(
    async (daysRange: ChartDaysRange = days) => {
      try {
        const response = await adminDashboardService.getActivityOverviewChart(
          daysRange
        );
        setActivityOverview(response.data);
        return response.data;
      } catch (err: any) {
        toast.error('حدث خطأ في تحميل الرسم البياني');
        throw err;
      }
    },
    [days]
  );

  const fetchAnnouncementsByCategory = useCallback(async () => {
    try {
      const response =
        await adminDashboardService.getAnnouncementsByCategoryChart();
      setAnnouncementsByCategory(response.data);
      return response.data;
    } catch (err: any) {
      toast.error('حدث خطأ في تحميل الرسم البياني');
      throw err;
    }
  }, []);

  const fetchAnnouncementsByGovernorate = useCallback(async () => {
    try {
      const response =
        await adminDashboardService.getAnnouncementsByGovernorateChart();
      setAnnouncementsByGovernorate(response.data);
      return response.data;
    } catch (err: any) {
      toast.error('حدث خطأ في تحميل الرسم البياني');
      throw err;
    }
  }, []);

  const fetchReportsStatus = useCallback(async () => {
    try {
      const response = await adminDashboardService.getReportsStatusChart();
      setReportsStatus(response.data);
      return response.data;
    } catch (err: any) {
      toast.error('حدث خطأ في تحميل الرسم البياني');
      throw err;
    }
  }, []);

  const fetchVerificationStatus = useCallback(async () => {
    try {
      const response = await adminDashboardService.getVerificationStatusChart();
      setVerificationStatus(response.data);
      return response.data;
    } catch (err: any) {
      toast.error('حدث خطأ في تحميل الرسم البياني');
      throw err;
    }
  }, []);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await adminDashboardService.getPaymentMethodsChart();
      setPaymentMethods(response.data);
      return response.data;
    } catch (err: any) {
      toast.error('حدث خطأ في تحميل الرسم البياني');
      throw err;
    }
  }, []);

  return {
    // All charts
    charts,
    loading,
    days,

    // Individual charts
    userGrowth,
    announcementsCreated,
    activityOverview,
    announcementsByCategory,
    announcementsByGovernorate,
    reportsStatus,
    verificationStatus,
    paymentMethods,

    // Actions
    fetchAllCharts,
    fetchUserGrowth,
    fetchAnnouncementsCreated,
    fetchActivityOverview,
    fetchAnnouncementsByCategory,
    fetchAnnouncementsByGovernorate,
    fetchReportsStatus,
    fetchVerificationStatus,
    fetchPaymentMethods,
    setDays,
  };
};

export default useAdminDashboardCharts;