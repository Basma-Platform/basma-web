import { useState, useCallback } from 'react';
import { userAnnouncementService } from '../services/userAnnouncementService';
import { toast } from 'react-toastify';

/**
 * Hook for managing Create/Edit announcement mutations
 *
 * NOTE: This hook handles MUTATIONS ONLY.
 * Form validation + Form state use React Hook Form + Zod (inside component).
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
      const response = await userAnnouncementService.createAnnouncement(formData);
      toast.success(response.message);
      return response;
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      }
      if (error.response?.status === 403) {
        const errorCode = error.response.data.error_code;
        if (errorCode === 'MONTHLY_LIMIT_REACHED') {
          toast.error(
            'لقد وصلت إلى الحد الأقصى للإعلانات هذا الشهر. وثّق حسابك للنشر غير المحدود.'
          );
        } else if (errorCode === 'HIGH_RISK_REQUIRES_VERIFICATION') {
          toast.error('هذه الفئة تتطلب توثيق الهوية');
        } else {
          toast.error(error.response.data.message);
        }
      } else if (error.response?.status !== 422) {
        const message =
          error.response?.data?.message || 'حدث خطأ في إنشاء الإعلان';
        toast.error(message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update announcement
   * PUT /api/v1/user/announcements/{id}
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
        toast.success('تم تحديث الإعلان بنجاح');
        return response;
      } catch (error: any) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors || {});
        } else {
          const message =
            error.response?.data?.message || 'حدث خطأ في تحديث الإعلان';
          toast.error(message);
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