import api from './api';

// ============================================
// Public Statistics Response
// ============================================
export interface PublicStats {
  users: {
    total: number;
    verified: number;
    display_format: string;
  };
  announcements: {
    total: number;
    active: number;
    featured: number;
    display_format: string;
  };
  satisfaction: {
    percentage: number;
    display_format: string;
  };
  rating: {
    average: number;
    total_ratings: number;
    display_format: string;
  };
  donations: {
    help_requests_published: number;
    achievements_count: number;
  };
  community: {
    posts_published: number;
  };
}

export const publicStatsService = {
  /**
   * GET /api/v1/public/statistics
   * Fetch public statistics (no auth required, cached 1 hour)
   */
  getStats: async (): Promise<PublicStats> => {
    const response = await api.get<{ success: boolean; data: PublicStats }>(
      '/v1/public/statistics'
    );
    return response.data.data;
  },
};

export default publicStatsService;