import { useState, useCallback } from 'react';
import { userAnnouncementService } from '../services/userAnnouncementService';
import { toast } from 'react-toastify';

/**
 * Hook for managing Create/Edit announcement mutations.
 *
 * NOTE:
 * - This hook handles MUTATIONS ONLY.
 * - Form validation + Form state use React Hook Form + Zod (inside component).
 * - Backend now uses a FLAT `category_id` (no more sub_category).
 * - `price_type` is `'paid' | 'barter'` only — `'free'` no longer exists.
 * - Barter requires `barter_offered` + `barter_requested`.
 *
 * Used in: CreateAnnouncementPage, EditAnnouncementPage
 */
export const useAnnouncementForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  /**
   * Create announcement
   * POST /api/v1/user/announcements
   */
  const createAnnouncement = useCallback(async (formData: FormData) => {
    try {
      setLoading(true);
      setErrors({});
      const response = await userAnnouncementService.createAnnouncement(
        formData
      );
      // createAnnouncement response DOES have `message` (CreateAnnouncementResponse)
      toast.success(response.message || 'تم النشر بنجاح');
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 422) {
        setErrors(data?.errors || {});
      } else if (status === 403) {
        const errorCode = data?.error_code;

        if (errorCode === 'MONTHLY_LIMIT_REACHED') {
          toast.error(
            data?.message ||
              'لقد وصلت إلى الحد الأقصى للعروض والطلبات هذا الشهر. وثّق حسابك للنشر غير المحدود.'
          );
        } else if (errorCode === 'HIGH_RISK_REQUIRES_VERIFICATION') {
          toast.error(data?.message || 'هذه الفئة تتطلب توثيق الهوية');
        } else if (errorCode === 'VERIFICATION_REQUIRED') {
          toast.error(
            data?.message ||
              'يجب توثيق الهوية أولاً للوصول إلى هذه الميزة'
          );
        } else {
          toast.error(data?.message || 'لا يمكن النشر حالياً');
        }
      } else if (status !== 422) {
        toast.error(data?.message || 'حدث خطأ أثناء النشر');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update announcement
   * PUT /api/v1/user/announcements/{id}
   * (sent as POST with _method=PUT, multipart/form-data)
   *
   * NOTE: updateAnnouncement returns UserAnnouncementDetailResponse
   *       (no `message` field) — we use a fixed success string.
   */
  const updateAnnouncement = useCallback(
    async (id: number, formData: FormData) => {
      try {
        setLoading(true);
        setErrors({});
        const response = await userAnnouncementService.updateAnnouncement(
          id,
          formData
        );
        // ✅ No `response.message` — using static success string
        toast.success('تم التحديث بنجاح');
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422) {
          setErrors(data?.errors || {});
        } else if (status === 403) {
          toast.error(data?.message || 'لا يمكن التعديل حالياً');
        } else {
          toast.error(data?.message || 'حدث خطأ أثناء التحديث');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    errors,
    createAnnouncement,
    updateAnnouncement,
  };
};

export default useAnnouncementForm;