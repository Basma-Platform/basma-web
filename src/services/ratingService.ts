import api from './api';
import type {
  ReviewStatusResponse,
  CreateRatingPayload,
  UpdateRatingPayload,
  Rating,
  UserRatingsResponse,
  MyReviewsListResponse,
  MyRatingStats,
  AdminRatingsListResponse,
  AdminRatingStats,
  PublicUserProfile,
} from '../types';

export const ratingService = {
  // ============================================
  // USER — Review Flow (Announcement Context)
  // ============================================

  /**
   * GET /api/v1/announcements/{id}/review-status
   * Check whether the current user can review the announcement owner
   */
  getReviewStatus: async (
    announcementId: number
  ): Promise<ReviewStatusResponse> => {
    const response = await api.get<ReviewStatusResponse>(
      `/v1/announcements/${announcementId}/review-status`
    );
    return response.data;
  },

  /**
   * POST /api/v1/ratings
   * Create a new rating
   */
  createRating: async (
    payload: CreateRatingPayload
  ): Promise<{ message: string; rating: Rating }> => {
    const response = await api.post<{ message: string; rating: Rating }>(
      '/v1/ratings',
      payload
    );
    return response.data;
  },

  /**
   * PUT /api/v1/ratings/{id}
   * Update a rating (within 24h)
   */
  updateRating: async (
    id: number,
    payload: UpdateRatingPayload
  ): Promise<{ message: string; rating: Rating }> => {
    const response = await api.put<{ message: string; rating: Rating }>(
      `/v1/ratings/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/ratings/{id}
   * Delete a rating (within 24h)
   */
  deleteRating: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/v1/ratings/${id}`
    );
    return response.data;
  },

  // ============================================
  // PUBLIC — User Profile & Ratings
  // ============================================

  /**
   * GET /api/v1/users/{id}
   * Public user profile (logged-in users only)
   *
   * ✅ Added — matches backend `UserReviewManagementController@show`
   */
  getPublicUser: async (id: number): Promise<PublicUserProfile> => {
    const response = await api.get<{ data: PublicUserProfile }>(
      `/v1/users/${id}`
    );
    return response.data.data;
  },

  /**
   * GET /api/v1/users/{id}/ratings
   * Public ratings for a specific user (auth required)
   */
  getUserRatings: async (
    userId: number,
    params?: {
      sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
      page?: number;
      per_page?: number;
    }
  ): Promise<UserRatingsResponse> => {
    const response = await api.get<UserRatingsResponse>(
      `/v1/users/${userId}/ratings`,
      { params }
    );
    return response.data;
  },

  // ============================================
  // MY REVIEWS (User Management)
  // ============================================

  getMyReceived: async (params?: {
    rating?: 1 | 2 | 3 | 4 | 5;
    page?: number;
    per_page?: number;
  }): Promise<MyReviewsListResponse> => {
    const response = await api.get<MyReviewsListResponse>(
      '/v1/my-reviews/received',
      { params }
    );
    return response.data;
  },

  getMyGiven: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<MyReviewsListResponse> => {
    const response = await api.get<MyReviewsListResponse>(
      '/v1/my-reviews/given',
      { params }
    );
    return response.data;
  },

  getMyStats: async (): Promise<MyRatingStats> => {
    const response = await api.get<MyRatingStats>('/v1/my-reviews/stats');
    return response.data;
  },

  // ============================================
  // ADMIN — Ratings Management
  // ============================================

  adminGetRatings: async (params?: {
    search?: string;
    rating?: 1 | 2 | 3 | 4 | 5;
    sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
    from_date?: string;
    to_date?: string;
    page?: number;
    per_page?: number;
  }): Promise<AdminRatingsListResponse> => {
    const response = await api.get<AdminRatingsListResponse>(
      '/v1/admin/ratings',
      { params }
    );
    return response.data;
  },

  adminGetStats: async (): Promise<AdminRatingStats> => {
    const response = await api.get<AdminRatingStats>(
      '/v1/admin/ratings/stats'
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/admin/ratings/{id}
   * Delete a violating rating.
   *
   * `reason` is OPTIONAL (backend accepts nullable, max 255 chars).
   */
  adminDeleteRating: async (
    id: number,
    reason?: string
  ): Promise<{ message: string }> => {
    const trimmed = reason?.trim();
    const body = trimmed ? { reason: trimmed } : {};

    const response = await api.delete<{ message: string }>(
      `/v1/admin/ratings/${id}`,
      { data: body }
    );
    return response.data;
  },
};

export default ratingService;