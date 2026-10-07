import api from './api';
import type {
  AdminDashboardResponse,
  AdminDashboardStats,
  AdminDashboardPending,
  AdminDashboardTop,
  AdminDashboardAdvanced,
  AdminDashboardCharts,
  ChartDaysRange,
  AdminActivityResponse,
  AdminActivityItem,
  AdminActivityFilters,
  ChartTimeSeries,
  ChartSimple,
  ChartDualSeries,
} from '../types';

/**
 * Extracts payload from either:
 *   - { data: {...}, meta: {...} }   (wrapped)
 *   - { ... }                         (unwrapped)
 * Returns the inner object/array.
 */
function unwrap<T>(body: any): T {
  if (
    body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    'data' in body &&
    body.data !== undefined &&
    body.data !== null
  ) {
    return body.data as T;
  }
  return body as T;
}

/**
 * Admin Dashboard Service
 * ═══════════════════════════════════════════════════════════
 * Backend response shapes (as of Sprint 05):
 * ─────────────────────────────────────────────────────────
 *  GET /admin/dashboard           → { data: {...}, meta: {...} }   ✅ wrapped
 *  GET /admin/dashboard/stats     → { users, announcements, ... }  ❌ unwrapped
 *  GET /admin/dashboard/pending   → { reports, verifications, ... }❌ unwrapped
 *  GET /admin/dashboard/top       → { top_users, ... }             ❌ unwrapped
 *  GET /admin/dashboard/advanced  → { retention, ... }             ❌ unwrapped
 *  GET /admin/dashboard/charts    → { data: {...} }                ✅ wrapped
 *  GET /admin/dashboard/charts/*  → { data: {...} }                ✅ wrapped
 *  GET /admin/dashboard/activity  → { data: [...], meta: {...} }   ✅ wrapped
 *  GET /admin/dashboard/activity/live → { data: [...] }            ✅ wrapped
 * ═══════════════════════════════════════════════════════════
 */
export const adminDashboardService = {
  // ============================================
  // MAIN DASHBOARD (wrapped with meta)
  // ============================================
  getMainDashboard: async (): Promise<AdminDashboardResponse> => {
    const response = await api.get<any>('/v1/admin/dashboard');
    const body = response.data;

    return {
      data: body?.data || body,
      meta: body?.meta || {
        generated_at: new Date().toISOString(),
        cache_ttl: 60,
      },
    };
  },

  // ============================================
  // STATS (unwrapped)
  // ============================================
  getStats: async (): Promise<{ data: AdminDashboardStats }> => {
    const response = await api.get<any>('/v1/admin/dashboard/stats');
    return { data: unwrap<AdminDashboardStats>(response.data) };
  },

  // ============================================
  // PENDING (unwrapped)
  // ============================================
  getPending: async (): Promise<{ data: AdminDashboardPending }> => {
    const response = await api.get<any>('/v1/admin/dashboard/pending');
    return { data: unwrap<AdminDashboardPending>(response.data) };
  },

  // ============================================
  // TOP (unwrapped)
  // ============================================
  getTop: async (): Promise<{ data: AdminDashboardTop }> => {
    const response = await api.get<any>('/v1/admin/dashboard/top');
    return { data: unwrap<AdminDashboardTop>(response.data) };
  },

  // ============================================
  // ADVANCED (unwrapped)
  // ============================================
  getAdvanced: async (): Promise<{ data: AdminDashboardAdvanced }> => {
    const response = await api.get<any>('/v1/admin/dashboard/advanced');
    return { data: unwrap<AdminDashboardAdvanced>(response.data) };
  },

  // ============================================
  // CHARTS — ALL (wrapped with data)
  // ============================================
  getCharts: async (
    days: ChartDaysRange = 30
  ): Promise<{ data: AdminDashboardCharts }> => {
    const response = await api.get<any>('/v1/admin/dashboard/charts', {
      params: { days },
    });
    const inner = unwrap<AdminDashboardCharts>(response.data);
    return { data: ensureChartsShape(inner) };
  },

  // ============================================
  // CHARTS — INDIVIDUAL (wrapped with data)
  // ============================================
  getUserGrowthChart: async (
    days: ChartDaysRange = 30
  ): Promise<{ data: ChartTimeSeries }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/user-growth',
      { params: { days } }
    );
    return { data: unwrap<ChartTimeSeries>(response.data) };
  },

  getAnnouncementsCreatedChart: async (
    days: ChartDaysRange = 30
  ): Promise<{ data: ChartTimeSeries }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/announcements-created',
      { params: { days } }
    );
    return { data: unwrap<ChartTimeSeries>(response.data) };
  },

  getActivityOverviewChart: async (
    days: ChartDaysRange = 30
  ): Promise<{ data: ChartTimeSeries }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/activity-overview',
      { params: { days } }
    );
    return { data: unwrap<ChartTimeSeries>(response.data) };
  },

  getAnnouncementsByCategoryChart: async (): Promise<{
    data: ChartSimple;
  }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/announcements-by-category'
    );
    return { data: unwrap<ChartSimple>(response.data) };
  },

  getAnnouncementsByGovernorateChart: async (): Promise<{
    data: ChartSimple;
  }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/announcements-by-governorate'
    );
    return { data: unwrap<ChartSimple>(response.data) };
  },

  getReportsStatusChart: async (): Promise<{ data: ChartSimple }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/reports-status'
    );
    return { data: unwrap<ChartSimple>(response.data) };
  },

  getVerificationStatusChart: async (): Promise<{ data: ChartSimple }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/verification-status'
    );
    return { data: unwrap<ChartSimple>(response.data) };
  },

  getPaymentMethodsChart: async (): Promise<{ data: ChartDualSeries }> => {
    const response = await api.get<any>(
      '/v1/admin/dashboard/charts/payment-methods'
    );
    return { data: unwrap<ChartDualSeries>(response.data) };
  },

  // ============================================
  // ACTIVITY (wrapped with data + meta)
  // ============================================
  getActivity: async (
    filters: AdminActivityFilters = {}
  ): Promise<AdminActivityResponse> => {
    const response = await api.get<any>('/v1/admin/dashboard/activity', {
      params: filters,
    });
    const body = response.data;

    return {
      data: Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body)
          ? body
          : [],
      meta: body?.meta || {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20,
      },
    };
  },

  getActivityLive: async (): Promise<{ data: AdminActivityItem[] }> => {
    const response = await api.get<any>('/v1/admin/dashboard/activity/live');
    const body = response.data;
    const data = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body)
        ? body
        : [];
    return { data };
  },
};

// ============================================
// Helper — ensure 8 chart keys exist
// ============================================
function ensureChartsShape(
  charts: Partial<AdminDashboardCharts> | undefined | null
): AdminDashboardCharts {
  const emptyTS: ChartTimeSeries = { labels: [], series: [] };
  const emptySimple: ChartSimple = { labels: [], series: [] };
  const emptyDual: ChartDualSeries = { labels: [], series: [] };

  const safe = charts || {};

  return {
    user_growth: safe.user_growth || emptyTS,
    announcements_created: safe.announcements_created || emptyTS,
    activity_overview: safe.activity_overview || emptyTS,
    announcements_by_category: safe.announcements_by_category || emptySimple,
    announcements_by_governorate:
      safe.announcements_by_governorate || emptySimple,
    reports_status: safe.reports_status || emptySimple,
    verification_status: safe.verification_status || emptySimple,
    payment_methods: safe.payment_methods || emptyDual,
  };
}

export default adminDashboardService;