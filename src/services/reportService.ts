import api from './api';
import type {
  ReportReasonsResponse,
  CreateReportPayload,
  CreateReportResponse,
  AdminReportsListResponse,
  AdminReportsStats,
  AdminReportDetail,
  ProcessReportPayload,
  ProcessReportResponse,
} from '../types';

export const reportService = {
  // ============================================
  // USER SIDE
  // ============================================

  /**
   * GET /api/v1/reports/reasons/{targetType}
   * Get available reasons for reporting a user or an announcement
   */
  getReasons: async (
    targetType: 'user' | 'announcement'
  ): Promise<ReportReasonsResponse> => {
    const response = await api.get<ReportReasonsResponse>(
      `/v1/reports/reasons/${targetType}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/reports
   * Submit a new report
   */
  createReport: async (
    payload: CreateReportPayload
  ): Promise<CreateReportResponse> => {
    const response = await api.post<CreateReportResponse>(
      '/v1/reports',
      payload
    );
    return response.data;
  },

  // ============================================
  // ADMIN SIDE
  // ============================================

  /**
   * GET /api/v1/admin/reports
   * List all reports (with filters + stats)
   */
  adminGetReports: async (params?: {
    status?: 'all' | 'pending' | 'reviewed' | 'rejected';
    target_type?: 'all' | 'user' | 'announcement';
    priority?: 'all' | 'low' | 'medium' | 'high';
    search?: string;
    sort?: 'newest' | 'oldest' | 'priority';
    page?: number;
    per_page?: number;
  }): Promise<AdminReportsListResponse> => {
    const response = await api.get<AdminReportsListResponse>(
      '/v1/admin/reports',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/reports/stats
   * Stats only (lightweight — for sidebar badge + refresh)
   */
  adminGetStats: async (): Promise<AdminReportsStats> => {
    const response = await api.get<AdminReportsStats>(
      '/v1/admin/reports/stats'
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/reports/{id}
   * Full report detail
   */
  adminGetReport: async (id: number): Promise<AdminReportDetail> => {
    const response = await api.get<AdminReportDetail>(
      `/v1/admin/reports/${id}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/reports/{id}/process
   * Apply an action to a pending report
   */
  adminProcessReport: async (
    id: number,
    payload: ProcessReportPayload
  ): Promise<ProcessReportResponse> => {
    const response = await api.post<ProcessReportResponse>(
      `/v1/admin/reports/${id}/process`,
      payload
    );
    return response.data;
  },
};

export default reportService;