import { useState, useCallback } from 'react';
import { donationInquiryService } from '../services/donationInquiryService';
import { toast } from 'react-toastify';
import type {
  DonationInquiryPayload,
  DonationInquiryCreateResponse,
  DonationInquiryTracking,
} from '../types';

/**
 * Donation Inquiry flow (public).
 *
 * Used in:
 *   - HelpRequestDetailsPage (submitting the inquiry)
 *   - TrackingPage (optional — lookup by tracking code)
 *
 * 409 handling:
 *   The backend returns `{ message: "inquiry_already_exists" }` — no
 *   `error_code` field. We detect this case and surface it via the
 *   `isDuplicate` flag so the caller (modal) can render a proper
 *   "you already inquired" state instead of a generic toast.
 */
export const useDonationInquiry = () => {
  const [submitting, setSubmitting] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [duplicateDetected, setDuplicateDetected] = useState(false);

  /**
   * POST /api/v1/donations/inquiries
   */
  const createInquiry = useCallback(
    async (
      payload: DonationInquiryPayload
    ): Promise<DonationInquiryCreateResponse> => {
      try {
        setSubmitting(true);
        setDuplicateDetected(false);
        const response = await donationInquiryService.create(payload);
        toast.success('تم استلام استفسارك بنجاح');
        return response;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        // ✅ 409 — user already submitted an inquiry for this help request
        if (status === 409) {
          // Backend sends `{ message: "inquiry_already_exists" }`
          // Some environments may send `{ error_code: "inquiry_already_exists" }`
          // We accept either.
          const isDuplicate =
            data?.message === 'inquiry_already_exists' ||
            data?.error_code === 'inquiry_already_exists';

          if (isDuplicate) {
            setDuplicateDetected(true);
            // No toast here — the modal shows a full dedicated state.
            // We only toast if the caller wants, so keep it silent here.
          } else {
            toast.warning(
              'لا يمكن إرسال هذا الاستفسار في الوقت الحالي.'
            );
          }
          throw error;
        }

        // ✅ 404 — help request no longer exists / was archived
        if (status === 404) {
          const isNotFound =
            data?.message === 'help_request_not_found' ||
            data?.error_code === 'help_request_not_found';

          toast.error(
            isNotFound
              ? 'طلب المساعدة لم يعد متاحاً. ربما تم أرشفته أو حذفه.'
              : 'الطلب غير موجود.'
          );
          throw error;
        }

        // ✅ 422 — validation errors
        if (status === 422) {
          toast.error('يرجى التحقق من البيانات المدخلة.');
          throw error;
        }

        // ✅ 403 — banned / blocked (rare for public endpoints)
        if (status === 403) {
          toast.error(
            data?.message ||
              'لا يمكنك إرسال الاستفسار في الوقت الحالي.'
          );
          throw error;
        }

        // ✅ Fallback — network or unexpected
        toast.error(
          data?.message || 'حدث خطأ أثناء إرسال الاستفسار. حاول لاحقاً.'
        );
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  /**
   * GET /api/v1/donations/inquiries/{tracking_code}
   */
  const trackInquiry = useCallback(
    async (trackingCode: string): Promise<DonationInquiryTracking> => {
      try {
        setTrackingLoading(true);
        const data = await donationInquiryService.track(trackingCode);
        return data;
      } catch (error: any) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 404) {
          const isNotFound =
            data?.message === 'tracking_code_not_found' ||
            data?.error_code === 'tracking_code_not_found';

          toast.error(
            isNotFound
              ? 'كود التتبع غير صحيح. تحقق من الرمز وحاول مرة أخرى.'
              : 'الاستفسار غير موجود.'
          );
        } else {
          toast.error(
            data?.message || 'حدث خطأ في تتبع الاستفسار. حاول لاحقاً.'
          );
        }

        throw error;
      } finally {
        setTrackingLoading(false);
      }
    },
    []
  );

  /**
   * Reset the duplicate flag (e.g. when the modal reopens).
   */
  const resetDuplicateFlag = useCallback(() => {
    setDuplicateDetected(false);
  }, []);

  return {
    submitting,
    trackingLoading,
    duplicateDetected,
    createInquiry,
    trackInquiry,
    resetDuplicateFlag,
  };
};

export default useDonationInquiry;