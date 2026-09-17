import api from './api';
import type {
  ProfileStatsResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  UploadProfileImageResponse,
  AdminStatsResponse,
  UpdateAdminProfilePayload,
  UpdateAdminProfileResponse,
  UploadAdminImageResponse,
} from '../types';

export const profileService = {
  // ============================================
  // USER PROFILE
  // ============================================

  /**
   * GET /api/v1/profile/stats
   * Get user stats + verification status + monthly limit
   */
  getStats: async (): Promise<ProfileStatsResponse> => {
    const response = await api.get<ProfileStatsResponse>('/v1/profile/stats');
    return response.data;
  },

  /**
   * PUT /api/v1/profile
   * Update user profile (name, whatsapp, region)
   */
  updateProfile: async (data: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>('/v1/profile', data);
    return response.data;
  },

  /**
   * POST /api/v1/profile/change-password
   */
  changePassword: async (data: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    const response = await api.post<ChangePasswordResponse>('/v1/profile/change-password', data);
    return response.data;
  },

  /**
   * POST /api/v1/profile/upload-image
   */
  uploadImage: async (file: File): Promise<UploadProfileImageResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadProfileImageResponse>(
      '/v1/profile/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // ============================================
  // ADMIN PROFILE
  // ============================================

  /**
   * GET /api/v1/admin/profile/stats
   * Get admin stats + today's activity
   */
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    const response = await api.get<AdminStatsResponse>('/v1/admin/profile/stats');
    return response.data;
  },

  /**
   * PUT /api/v1/admin/profile
   * Update admin profile (name only)
   */
  updateAdminProfile: async (data: UpdateAdminProfilePayload): Promise<UpdateAdminProfileResponse> => {
    const response = await api.put<UpdateAdminProfileResponse>('/v1/admin/profile', data);
    return response.data;
  },

  /**
   * POST /api/v1/admin/profile/change-password
   */
  changeAdminPassword: async (data: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    const response = await api.post<ChangePasswordResponse>('/v1/admin/profile/change-password', data);
    return response.data;
  },

  /**
   * POST /api/v1/admin/profile/upload-image
   */
  uploadAdminImage: async (file: File): Promise<UploadAdminImageResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadAdminImageResponse>(
      '/v1/admin/profile/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default profileService;