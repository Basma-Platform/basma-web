import api from './api';
import type {
  DonationInquiryPayload,
  DonationInquiryCreateResponse,
  DonationInquiryTracking,
} from '../types';

/**
 * Donation Inquiry Service (Public)
 * ═══════════════════════════════════════════════════════════
 * POST /donations/inquiries          → create inquiry
 * GET  /donations/inquiries/{code}   → track by tracking_code
 * ═══════════════════════════════════════════════════════════
 */
export const donationInquiryService = {
  /**
   * POST /api/v1/donations/inquiries
   * Public — no auth required (but logged-in users get an easier flow).
   * Returns tracking_code + video_access (one-time URL) + platform contact.
   */
  create: async (
    payload: DonationInquiryPayload
  ): Promise<DonationInquiryCreateResponse> => {
    const response = await api.post<DonationInquiryCreateResponse>(
      '/v1/donations/inquiries',
      payload
    );
    return response.data;
  },

  /**
   * GET /api/v1/donations/inquiries/{tracking_code}
   * Public tracking.
   */
  track: async (trackingCode: string): Promise<DonationInquiryTracking> => {
    const response = await api.get<DonationInquiryTracking>(
      `/v1/donations/inquiries/${encodeURIComponent(trackingCode)}`
    );
    return response.data;
  },
};

export default donationInquiryService;