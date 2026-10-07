import api from './api';
import type {
  PlatformContactInfo,
  BasmaFundPublicStatsResponse,
} from '../types';

/**
 * Basma Fund Public Service
 * ═══════════════════════════════════════════════════════════
 * GET /donations/contact   → platform contact info
 * GET /donations/stats     → public totals
 * ═══════════════════════════════════════════════════════════
 */
export const basmaFundPublicService = {
  /**
   * GET /api/v1/donations/contact
   */
  getContact: async (): Promise<{ data: PlatformContactInfo }> => {
    const response = await api.get<{ data: PlatformContactInfo }>(
      '/v1/donations/contact'
    );
    return response.data;
  },

  /**
   * GET /api/v1/donations/stats
   * Cached on the backend (safe to call on page load).
   */
  getStats: async (): Promise<BasmaFundPublicStatsResponse> => {
    const response = await api.get<BasmaFundPublicStatsResponse>(
      '/v1/donations/stats'
    );
    return response.data;
  },
};

export default basmaFundPublicService;