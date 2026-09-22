import { useState, useCallback, useEffect, useRef } from 'react';
import { verificationService } from '../services/verificationService';
import { toast } from 'react-toastify';
import type {
  VerificationStatusResponse,
  VerificationRequirements,
  DocumentType,
  UploadIdResponse,
} from '../types';

/**
 * Hook for managing the current user's verification status
 * Used in: VerifyIdentityPage
 */
export const useVerification = () => {
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [requirements, setRequirements] =
    useState<VerificationRequirements | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 🆕 Track last upload warning (for reupload after rejection)
  const [lastUploadWarning, setLastUploadWarning] = useState<
    UploadIdResponse['warning'] | null
  >(null);

  // Track if requirements already fetched
  const requirementsFetched = useRef(false);

  /**
   * Fetch verification requirements
   */
  const fetchRequirements = useCallback(async () => {
    if (requirementsFetched.current) return requirements;

    try {
      const data = await verificationService.getRequirements();
      setRequirements(data);
      requirementsFetched.current = true;
      return data;
    } catch (error: any) {
      console.warn('Failed to load verification requirements:', error);
      return null;
    }
  }, [requirements]);

  /**
   * Fetch current verification status
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
   * ✅ Handles reupload warning (when previous request was rejected)
   *
   * Returns the full UploadIdResponse so caller can access `warning`
   */
  const uploadId = useCallback(
    async (
      file: File,
      documentType: DocumentType
    ): Promise<UploadIdResponse> => {
      try {
        setUploading(true);
        setLastUploadWarning(null);

        const response = await verificationService.uploadId(
          file,
          documentType
        );

        // 🆕 Handle warning (reupload after rejection)
        if (response.warning) {
          // Save warning for UI to display
          setLastUploadWarning(response.warning);

          // Show a brief toast (the modal will show full details)
          toast.warning(
            'لديك طلب سابق تم رفضه. تم استلام طلبك الجديد بنجاح.',
            { autoClose: 5000 }
          );
        } else {
          toast.success(response.message);
        }

        // Refresh status after successful upload
        await fetchStatus();

        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في رفع الصورة';

        // Special handling for duplicate image error (400)
        if (error.response?.status === 400) {
          toast.error(message, { autoClose: 6000 });
        } else {
          toast.error(message);
        }
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [fetchStatus]
  );

  /**
   * Clear the reupload warning (after modal shown)
   */
  const clearUploadWarning = useCallback(() => {
    setLastUploadWarning(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchStatus();
    fetchRequirements();
  }, [fetchStatus, fetchRequirements]);

  return {
    status,
    requirements,
    loading,
    uploading,
    lastUploadWarning, // 🆕
    fetchStatus,
    fetchRequirements,
    uploadId,
    clearUploadWarning, // 🆕
  };
};

export default useVerification;