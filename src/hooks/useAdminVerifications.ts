import { useState, useCallback } from 'react';
import { verificationService } from '../services/verificationService';
import { toast } from 'react-toastify';
import type {
  AdminVerificationRequest,
  AdminVerificationDetail,
  VerificationActionPayload,
  ExtractDataPayload,
} from '../types';

// ============================================
// Internal Helper Types
// ============================================
interface AdminVerificationsMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface AdminVerificationsStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

/**
 * Hook for managing admin verification requests
 * Used in: AdminVerificationListPage, AdminVerificationDetailPage
 *
 * Provides:
 * - List operations: fetchRequests (with filters + pagination)
 * - Detail operations: fetchDetail (single request with access logs)
 * - Image operations: viewImage (secured blob with reason logging)
 * - Data operations: extractData (save admin-extracted data from ID)
 * - Decision operations: approveRequest, rejectRequest
 */
export const useAdminVerifications = () => {
  // ============================================
  // List State
  // ============================================
  const [requests, setRequests] = useState<AdminVerificationRequest[]>([]);
  const [meta, setMeta] = useState<AdminVerificationsMeta | null>(null);
  const [stats, setStats] = useState<AdminVerificationsStats | null>(null);
  const [loading, setLoading] = useState(false);

  // ============================================
  // Detail State
  // ============================================
  const [detail, setDetail] = useState<AdminVerificationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ============================================
  // Action State (approve/reject/extract)
  // ============================================
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // Image State (secure blob)
  // ============================================
  const [imageLoading, setImageLoading] = useState(false);

  // ============================================
  // LIST OPERATIONS
  // ============================================

  /**
   * Fetch list of verification requests
   * GET /api/v1/admin/verification-requests
   *
   * @param params - { status, search, page, per_page }
   */
  const fetchRequests = useCallback(
    async (params?: {
      status?: 'all' | 'pending' | 'approved' | 'rejected';
      search?: string;
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await verificationService.getRequests(params);
        setRequests(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل الطلبات';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================
  // DETAIL OPERATIONS
  // ============================================

  /**
   * Fetch single request details
   * GET /api/v1/admin/verification-requests/{id}
   *
   * Returns: full detail with access_logs, extracted_data, has_image, auto_delete_at
   */
  const fetchDetail = useCallback(async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await verificationService.getRequest(id);
      setDetail(response);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل التفاصيل';
      toast.error(message);
      throw error;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ============================================
  // SECURE IMAGE OPERATIONS
  // ============================================

  /**
   * 🔒 Fetch image as Blob (secured endpoint)
   * GET /api/v1/admin/verification-requests/{id}/view-image
   *
   * ⚠️ IMPORTANT:
   * - Every call logs an access entry in the DB
   * - The `reason` is REQUIRED for meaningful audit trail
   * - Caller is responsible for URL.createObjectURL() + URL.revokeObjectURL()
   *
   * @param id - Request ID
   * @param reason - Reason for viewing (logged in access log)
   */
  const viewImage = useCallback(
    async (id: number, reason: string): Promise<Blob> => {
      try {
        setImageLoading(true);
        const blob = await verificationService.viewImage(id, reason);
        return blob;
      } catch (error: any) {
        // 410 Gone → image was auto-deleted
        if (error.response?.status === 410) {
          // Don't toast here — caller (page) handles the UI state
          throw error;
        }

        // 404 Not Found
        if (error.response?.status === 404) {
          toast.error('الطلب غير موجود');
          throw error;
        }

        // Other errors
        const message =
          error.response?.data?.message || 'حدث خطأ في تحميل الصورة';
        toast.error(message);
        throw error;
      } finally {
        setImageLoading(false);
      }
    },
    []
  );

  // ============================================
  // DATA EXTRACTION
  // ============================================

  /**
   * Extract data from ID document (admin action)
   * POST /api/v1/admin/verification-requests/{id}/extract-data
   *
   * Saves extracted_data + extracted_by + extracted_at
   */
  const extractData = useCallback(
    async (id: number, payload: ExtractDataPayload) => {
      try {
        setActionLoading(true);
        const response = await verificationService.extractData(id, payload);
        setDetail(response.request);
        toast.success(response.message || 'تم حفظ البيانات المستخرجة بنجاح');
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في حفظ البيانات';
        toast.error(message);
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // DECISION OPERATIONS
  // ============================================

  /**
   * Approve a verification request
   * POST /api/v1/admin/verification-requests/{id}/approve
   *
   * Effects:
   * - Sets status = approved
   * - Sets user.is_verified = true
   * - Schedules auto_delete_at (90 days)
   * - Logs admin action
   * - Notifies user
   */
  const approveRequest = useCallback(
    async (id: number, payload: VerificationActionPayload = {}) => {
      try {
        setActionLoading(true);
        const response = await verificationService.approve(id, payload);
        setDetail(response.request);
        toast.success(response.message || 'تمت الموافقة على التحقق');
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في الموافقة';
        toast.error(message);
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  /**
   * Reject a verification request
   * POST /api/v1/admin/verification-requests/{id}/reject
   *
   * Effects:
   * - Sets status = rejected
   * - Saves admin_notes (rejection reason)
   * - Logs admin action
   * - Notifies user with reason
   */
  const rejectRequest = useCallback(
    async (id: number, payload: VerificationActionPayload) => {
      try {
        setActionLoading(true);
        const response = await verificationService.reject(id, payload);
        setDetail(response.request);
        toast.success(response.message || 'تم رفض طلب التحقق');
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في الرفض';
        toast.error(message);
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    []
  );

  // ============================================
  // RETURN
  // ============================================

  return {
    // ---------- List ----------
    requests,
    meta,
    stats,
    loading,
    fetchRequests,

    // ---------- Detail ----------
    detail,
    detailLoading,
    fetchDetail,

    // ---------- Actions ----------
    actionLoading,
    imageLoading,
    viewImage,
    extractData,
    approveRequest,
    rejectRequest,
  };
};

export default useAdminVerifications;