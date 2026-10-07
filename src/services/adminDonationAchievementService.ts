import api from './api';
import type {
  DonationAchievement,
  DonationAchievementsResponse,
  AdminDonationAchievementPayload,
  AdminDonationAchievementsStats,
} from '../types';

/**
 * Admin Donation Achievement Service
 * ═══════════════════════════════════════════════════════════
 *  GET    /admin/donation-achievements
 *  GET    /admin/donation-achievements/stats
 *  POST   /admin/donation-achievements                (multipart)
 *  PUT    /admin/donation-achievements/{id}           (multipart)
 *  DELETE /admin/donation-achievements/{id}
 *  POST   /admin/donation-achievements/{id}/toggle-featured
 *  POST   /admin/donation-achievements/{id}/toggle-active
 * ═══════════════════════════════════════════════════════════
 */
export const adminDonationAchievementService = {
  // ============================================
  // LIST
  // ============================================
  getList: async (params?: {
    is_active?: boolean;
    is_featured?: boolean;
    search?: string;
    sort?: 'newest' | 'oldest' | 'order' | 'date_desc';
    page?: number;
    per_page?: number;
  }): Promise<DonationAchievementsResponse> => {
    // ✅ Convert booleans → 1/0 (Laravel `boolean` rule accepts these)
    // ✅ Drop empty strings / null / undefined
    const cleanParams: Record<string, unknown> = {};

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Skip undefined / null / empty string
        if (value === undefined || value === null || value === '') return;

        // Convert booleans to 1/0
        if (key === 'is_active' || key === 'is_featured') {
          if (typeof value !== 'boolean') return;
          cleanParams[key] = value ? 1 : 0;
          return;
        }

        cleanParams[key] = value;
      });
    }

    const response = await api.get<DonationAchievementsResponse>(
      '/v1/admin/donation-achievements',
      { params: cleanParams }
    );
    return response.data;
  },

  // ============================================
  // STATS  🆕
  // ============================================
  getStats: async (): Promise<AdminDonationAchievementsStats> => {
    const response = await api.get<AdminDonationAchievementsStats>(
      '/v1/admin/donation-achievements/stats'
    );
    return response.data;
  },

  // ============================================
  // CREATE
  // ============================================
  create: async (
    payload: AdminDonationAchievementPayload
  ): Promise<{ message: string; data: DonationAchievement }> => {
    const formData = buildAchievementFormData(payload);
    const response = await api.post(
      '/v1/admin/donation-achievements',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // ============================================
  // UPDATE
  // ============================================
  update: async (
    id: number,
    payload: AdminDonationAchievementPayload
  ): Promise<{ message: string; data: DonationAchievement }> => {
    const formData = buildAchievementFormData(payload);
    formData.append('_method', 'PUT');
    const response = await api.post(
      `/v1/admin/donation-achievements/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // ============================================
  // DELETE
  // ============================================
  delete: async (
    id: number,
    reason?: string
  ): Promise<{ message: string }> => {
    const trimmed = reason?.trim();
    const body = trimmed ? { reason: trimmed } : {};
    const response = await api.delete<{ message: string }>(
      `/v1/admin/donation-achievements/${id}`,
      { data: body }
    );
    return response.data;
  },

  // ============================================
  // TOGGLE FEATURED
  // ✅ Now returns full `data` (backend was updated)
  // ============================================
  toggleFeatured: async (
    id: number
  ): Promise<{ message: string; data: DonationAchievement }> => {
    const response = await api.post<{
      message: string;
      data: DonationAchievement;
    }>(`/v1/admin/donation-achievements/${id}/toggle-featured`);
    return response.data;
  },

  // ============================================
  // TOGGLE ACTIVE
  // ✅ Now returns full `data` (backend was updated)
  // ============================================
  toggleActive: async (
    id: number
  ): Promise<{ message: string; data: DonationAchievement }> => {
    const response = await api.post<{
      message: string;
      data: DonationAchievement;
    }>(`/v1/admin/donation-achievements/${id}/toggle-active`);
    return response.data;
  },
};

// ============================================
// FormData builder
// ============================================
function buildAchievementFormData(
  payload: AdminDonationAchievementPayload
): FormData {
  const fd = new FormData();

  fd.append('title', payload.title);
  fd.append('description', payload.description);

  if (payload.cover_image) {
    fd.append('cover_image', payload.cover_image);
  }

  // ✅ Backend prepareForValidation() handles JSON → array conversion
  // We still send as JSON string for multipart/form-data compatibility
  if (payload.metadata) {
    // Only send non-null numeric values
    const cleanMeta: Record<string, number> = {};
    if (payload.metadata.beneficiaries != null) {
      cleanMeta.beneficiaries = payload.metadata.beneficiaries;
    }
    if (payload.metadata.donors != null) {
      cleanMeta.donors = payload.metadata.donors;
    }
    if (payload.metadata.amount != null) {
      cleanMeta.amount = payload.metadata.amount;
    }
    if (Object.keys(cleanMeta).length > 0) {
      fd.append('metadata', JSON.stringify(cleanMeta));
    }
  }

  if (payload.video_url) {
    fd.append('video_url', payload.video_url);
  }
  if (payload.display_order != null) {
    fd.append('display_order', String(payload.display_order));
  }

  // ✅ Send booleans as "1"/"0" strings (Laravel prepareForValidation handles both)
  if (payload.is_active != null) {
    fd.append('is_active', payload.is_active ? '1' : '0');
  }
  if (payload.is_featured != null) {
    fd.append('is_featured', payload.is_featured ? '1' : '0');
  }

  if (payload.achievement_date) {
    fd.append('achievement_date', payload.achievement_date);
  }

  return fd;
}

export default adminDonationAchievementService;