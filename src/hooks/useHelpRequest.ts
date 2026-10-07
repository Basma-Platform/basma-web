import { useState, useCallback } from 'react';
import { helpRequestService } from '../services/helpRequestService';
import { toast } from 'react-toastify';
import type { HelpRequestPublic } from '../types';

/**
 * Public Help Request detail.
 * Used in: HelpRequestDetailsPage
 */
export const useHelpRequest = () => {
  const [request, setRequest] = useState<HelpRequestPublic | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await helpRequestService.getPublicDetail(id);
      setRequest(response.data);
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404) {
        toast.error(message || 'الطلب غير موجود');
      } else {
        toast.error(message || 'حدث خطأ في تحميل الطلب');
      }

      setRequest(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRequest(null);
    setLoading(true);
  }, []);

  return {
    request,
    loading,
    fetchDetail,
    reset,
  };
};

export default useHelpRequest;