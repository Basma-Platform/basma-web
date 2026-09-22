import { useState, useCallback } from 'react';
import { reportService } from '../services/reportService';
import { toast } from 'react-toastify';
import type {
  ReportTargetType,
  ReportReason,
  CreateReportPayload,
} from '../types';

/**
 * Hook for managing the report submission flow (user side).
 *
 * Used in: ReportModal
 *
 * Handles:
 * - Fetching reasons for a target type (user / announcement)
 * - Submitting the report
 * - Duplicate detection (409)
 */
export const useReportForm = () => {
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [reasonsLoading, setReasonsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch reasons for a target type
   */
  const fetchReasons = useCallback(async (targetType: ReportTargetType) => {
    try {
      setReasonsLoading(true);
      const data = await reportService.getReasons(targetType);
      setReasons(data.reasons);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل أسباب الإبلاغ';
      toast.error(message);
      throw error;
    } finally {
      setReasonsLoading(false);
    }
  }, []);

  /**
   * Submit a report
   * Returns true on success, throws on failure (including 409 duplicate)
   */
  const submitReport = useCallback(
    async (payload: CreateReportPayload): Promise<void> => {
      try {
        setSubmitting(true);
        const response = await reportService.createReport(payload);
        toast.success(
          response.message ||
            'تم إرسال البلاغ بنجاح. شكراً لك على مساهمتك في حماية المجتمع.'
        );
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          toast.warning(
            message || 'لقد أبلغت بالفعل عن هذا المحتوى وهو قيد المراجعة'
          );
        } else if (status === 400) {
          toast.error(message || 'لا يمكن إرسال هذا البلاغ');
        } else {
          toast.error(message || 'حدث خطأ أثناء إرسال البلاغ');
        }
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  /**
   * Reset reasons (when closing the modal)
   */
  const reset = useCallback(() => {
    setReasons([]);
  }, []);

  return {
    reasons,
    reasonsLoading,
    submitting,
    fetchReasons,
    submitReport,
    reset,
  };
};

export default useReportForm;