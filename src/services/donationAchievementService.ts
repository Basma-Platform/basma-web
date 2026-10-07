import api from './api';
import type {
  DonationAchievement,
  DonationAchievementsResponse,
  DonationAchievementsFeaturedResponse,
} from '../types';

/**
 * Donation Achievement Service (Public)
 * ═══════════════════════════════════════════════════════════
 * GET /donations/achievements
 * GET /donations/achievements/featured
 * GET /donations/achievements/{id}
 *
 * ✅ Server-side search + sort are now supported:
 *      ?search=<string>&sort=newest|oldest|order&page=1&per_page=12
 * ═══════════════════════════════════════════════════════════
 */
export const donationAchievementService = {
  /**
   * GET /api/v1/donations/achievements
   * Paginated list of active achievements with server-side
   * search + sort.
   */
  getList: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    sort?: 'newest' | 'oldest' | 'order';
  }): Promise<DonationAchievementsResponse> => {
    // Strip empty string params to keep the URL clean
    const cleanParams: Record<string, string | number> = {};
    if (params) {
      if (params.page != null) cleanParams.page = params.page;
      if (params.per_page != null) cleanParams.per_page = params.per_page;
      if (params.search && params.search.trim() !== '') {
        cleanParams.search = params.search.trim();
      }
      if (params.sort) cleanParams.sort = params.sort;
    }

    const response = await api.get<DonationAchievementsResponse>(
      '/v1/donations/achievements',
      { params: cleanParams }
    );
    return response.data;
  },

  /**
   * GET /api/v1/donations/achievements/featured
   * Featured achievements (for carousel).
   */
  getFeatured: async (): Promise<DonationAchievementsFeaturedResponse> => {
    const response = await api.get<DonationAchievementsFeaturedResponse>(
      '/v1/donations/achievements/featured'
    );
    return response.data;
  },

  /**
   * GET /api/v1/donations/achievements/{id}
   * Single achievement detail.
   */
  getDetail: async (id: number): Promise<{ data: DonationAchievement }> => {
    const response = await api.get<{ data: DonationAchievement }>(
      `/v1/donations/achievements/${id}`
    );
    return response.data;
  },
};

export default donationAchievementService;