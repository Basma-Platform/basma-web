import { useState, useCallback, useEffect } from 'react';
import { verificationService } from '../services/verificationService';
import { toast } from 'react-toastify';
import type { VerificationStatusResponse } from '../types';

/**
 * Hook for managing the current user's verification status
 * Used in: VerifyIdentityPage
 */
export const useVerification = () => {
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  /**
   * Fetch current verification status
   * GET /api/v1/user/verification/status
   */
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await verificationService.getStatus();
      setStatus(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل حالة التحقق';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload ID document
   * POST /api/v1/user/verification/upload
   *
   * ✅ Returns `Promise<void>` — callers don't need the response body
   * (success/failure is reflected by `status` refresh + toasts).
   */
  const uploadId = useCallback(
    async (file: File): Promise<void> => {
      try {
        setUploading(true);
        const response = await verificationService.uploadId(file);
        toast.success(response.message);
        // Refresh status after successful upload
        await fetchStatus();
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في رفع الصورة';
        toast.error(message);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [fetchStatus]
  );

  // Auto-fetch on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    uploading,
    fetchStatus,
    uploadId,
  };
};

export default useVerification;