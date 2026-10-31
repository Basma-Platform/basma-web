import api from './api';
import type {
  CommunityPost,
  UserCommunityPost,
  AdminCommunityPostDetail,
  CommunityPublicStats,
  AdminCommunityStats,
  CommunityLimitsResponse,
  CommunityPostsPublicResponse,
  CommunityPostsUserResponse,
  CommunityPostsAdminResponse,
  CommunityPostTrackResponse,
  CommunityPostCreateResponse,
  CommunityPostUpdateResponse,
  CommunityPostResolveResponse,
  CommunityPublicFilters,
  CommunityUserFilters,
  CommunityAdminFilters,
} from '../types';

/**
 * Community Posts Service
 * ============================================================
 *  Public:
 *    GET  /community/posts
 *    GET  /community/posts/{id}
 *    POST /community/posts/{id}/track
 *    GET  /community/stats
 *
 *  User (verified):
 *    GET    /user/community-posts/limits
 *    GET    /user/community-posts
 *    GET    /user/community-posts/{id}
 *    POST   /user/community-posts                (multipart)
 *    PUT    /user/community-posts/{id}           (multipart)
 *    DELETE /user/community-posts/{id}
 *    POST   /user/community-posts/{id}/resolve
 *
 *  Admin:
 *    GET    /admin/community-posts
 *    GET    /admin/community-posts/stats
 *    GET    /admin/community-posts/{id}
 *    POST   /admin/community-posts/{id}/approve
 *    POST   /admin/community-posts/{id}/reject
 *    DELETE /admin/community-posts/{id}
 *    POST   /admin/community-posts/{id}/pin
 *    DELETE /admin/community-posts/{id}/unpin
 * ============================================================
 */
export const communityService = {
  // ============================================
  // PUBLIC
  // ============================================
  getPublicPosts: async (
    params?: CommunityPublicFilters
  ): Promise<CommunityPostsPublicResponse> => {
    const response = await api.get<CommunityPostsPublicResponse>(
      '/v1/community/posts',
      { params }
    );
    return response.data;
  },

  getPost: async (id: number): Promise<CommunityPost> => {
    const response = await api.get<CommunityPost>(
      `/v1/community/posts/${id}`
    );
    return response.data;
  },

  trackWhatsappClick: async (
    id: number
  ): Promise<CommunityPostTrackResponse> => {
    const response = await api.post<CommunityPostTrackResponse>(
      `/v1/community/posts/${id}/track`
    );
    return response.data;
  },

  getPublicStats: async (): Promise<CommunityPublicStats> => {
    const response = await api.get<CommunityPublicStats>(
      '/v1/community/stats'
    );
    return response.data;
  },

  // ============================================
  // USER (verified)
  // ============================================
  getLimits: async (): Promise<CommunityLimitsResponse> => {
    const response = await api.get<CommunityLimitsResponse>(
      '/v1/user/community-posts/limits'
    );
    return response.data;
  },

  getMyPosts: async (
    params?: CommunityUserFilters
  ): Promise<CommunityPostsUserResponse> => {
    const response = await api.get<CommunityPostsUserResponse>(
      '/v1/user/community-posts',
      { params }
    );
    return response.data;
  },

  getMyPost: async (id: number): Promise<UserCommunityPost> => {
    const response = await api.get<UserCommunityPost>(
      `/v1/user/community-posts/${id}`
    );
    return response.data;
  },

  createPost: async (
    formData: FormData
  ): Promise<CommunityPostCreateResponse> => {
    const response = await api.post<CommunityPostCreateResponse>(
      '/v1/user/community-posts',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  updatePost: async (
    id: number,
    formData: FormData
  ): Promise<CommunityPostUpdateResponse> => {
    formData.append('_method', 'PUT');
    const response = await api.post<CommunityPostUpdateResponse>(
      `/v1/user/community-posts/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  deletePost: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/v1/user/community-posts/${id}`
    );
    return response.data;
  },

  resolvePost: async (id: number): Promise<CommunityPostResolveResponse> => {
    const response = await api.post<CommunityPostResolveResponse>(
      `/v1/user/community-posts/${id}/resolve`
    );
    return response.data;
  },

  // ============================================
  // ADMIN
  // ============================================
  adminGetPosts: async (
    params?: CommunityAdminFilters
  ): Promise<CommunityPostsAdminResponse> => {
    const response = await api.get<CommunityPostsAdminResponse>(
      '/v1/admin/community-posts',
      { params }
    );
    return response.data;
  },

  adminGetStats: async (): Promise<AdminCommunityStats> => {
    const response = await api.get<AdminCommunityStats>(
      '/v1/admin/community-posts/stats'
    );
    return response.data;
  },

  adminGetPost: async (id: number): Promise<AdminCommunityPostDetail> => {
    const response = await api.get<AdminCommunityPostDetail>(
      `/v1/admin/community-posts/${id}`
    );
    return response.data;
  },

  adminApprove: async (
    id: number,
    payload: { admin_notes?: string } = {}
  ): Promise<{ message: string; data: AdminCommunityPostDetail }> => {
    const response = await api.post<{
      message: string;
      data: AdminCommunityPostDetail;
    }>(`/v1/admin/community-posts/${id}/approve`, payload);
    return response.data;
  },

  adminReject: async (
    id: number,
    payload: { admin_notes: string }
  ): Promise<{ message: string; data: AdminCommunityPostDetail }> => {
    const response = await api.post<{
      message: string;
      data: AdminCommunityPostDetail;
    }>(`/v1/admin/community-posts/${id}/reject`, payload);
    return response.data;
  },

  adminDelete: async (
    id: number,
    payload: { reason?: string } = {}
  ): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/v1/admin/community-posts/${id}`,
      { data: payload }
    );
    return response.data;
  },

  adminPin: async (
    id: number
  ): Promise<{ message: string; data: AdminCommunityPostDetail }> => {
    const response = await api.post<{
      message: string;
      data: AdminCommunityPostDetail;
    }>(`/v1/admin/community-posts/${id}/pin`);
    return response.data;
  },

  adminUnpin: async (
    id: number
  ): Promise<{ message: string; data: AdminCommunityPostDetail }> => {
    const response = await api.delete<{
      message: string;
      data: AdminCommunityPostDetail;
    }>(`/v1/admin/community-posts/${id}/unpin`);
    return response.data;
  },
};

export default communityService;