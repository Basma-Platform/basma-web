import api from './api';
import type {
  AdminDonationInquiriesListResponse,
  AdminDonationInquiryDetail,
  AdminDonationInquiryStats,
  DonationInquiryStatusPayload,
} from '../types';

/**
 * Admin Donation Inquiry Service
 * ═══════════════════════════════════════════════════════════
 *  GET /admin/donation-inquiries                 → list + stats
 *  GET /admin/donation-inquiries/{id}            → detail
 *  PUT /admin/donation-inquiries/{id}/status     → change status
 *  POST /admin/donation-inquiries/{id}/note      → add admin note
 *  GET /admin/donation-inquiries/stats           → stats only
 * ═══════════════════════════════════════════════════════════
 */
export const adminDonationInquiryService = {
  /**
   * GET /api/v1/admin/donation-inquiries
   */
  getList: async (params?: {
    status?: 'all' | 'new' | 'contacted' | 'completed' | 'cancelled';
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<AdminDonationInquiriesListResponse> => {
    const response = await api.get<AdminDonationInquiriesListResponse>(
      '/v1/admin/donation-inquiries',
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/donation-inquiries/stats
   */
  getStats: async (): Promise<AdminDonationInquiryStats> => {
    const response = await api.get<AdminDonationInquiryStats>(
      '/v1/admin/donation-inquiries/stats'
    );
    return response.data;
  },

  /**
   * GET /api/v1/admin/donation-inquiries/{id}
   */
  getDetail: async (id: number): Promise<AdminDonationInquiryDetail> => {
    const response = await api.get<AdminDonationInquiryDetail>(
      `/v1/admin/donation-inquiries/${id}`
    );
    return response.data;
  },

  /**
   * PUT /api/v1/admin/donation-inquiries/{id}/status
   */
  updateStatus: async (
    id: number,
    payload: DonationInquiryStatusPayload
  ): Promise<{ message: string; data: AdminDonationInquiryDetail }> => {
    const response = await api.put(
      `/v1/admin/donation-inquiries/${id}/status`,
      payload
    );
    return response.data;
  },

  /**
   * POST /api/v1/admin/donation-inquiries/{id}/note
   */
  addNote: async (
    id: number,
    adminNotes: string
  ): Promise<{ message: string; data: AdminDonationInquiryDetail }> => {
    const response = await api.post(
      `/v1/admin/donation-inquiries/${id}/note`,
      { admin_notes: adminNotes }
    );
    return response.data;
  },
};

export default adminDonationInquiryService;