import { useState, useCallback } from 'react';
import { featuredRequestService } from '../services/featuredRequestService';
import { featuredPricingService } from '../services/featuredPricingService';
import { toast } from 'react-toastify';
import type {
  FeaturedRequest,
  FeaturedPricing,
  FeaturedRequestPayload,
  FeaturedStatusResponse,
  PlatformPaymentMethod,
} from '../types';

/**
 * Hook for managing Featured Requests
 *
 * ⚠️ NOTE: Form validation uses React Hook Form + Zod (inside component).
 * This hook handles: fetching data + submitting request.
 *
 * Used in: RequestFeaturedPage, FeaturedRequestsHistoryPage
 *
 * Provides:
 * - fetchPricingAndMethods (pricing + payment methods)
 * - fetchFeaturedStatus (for a specific announcement)
 * - requestFeatured (submit request)
 * - fetchMyFeaturedRequests (history)
 */
export const useFeaturedRequest = () => {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<FeaturedPricing[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PlatformPaymentMethod[]>([]);
  const [status, setStatus] = useState<FeaturedStatusResponse | null>(null);
  const [requests, setRequests] = useState<FeaturedRequest[]>([]);

  /**
   * Fetch pricing + payment methods (in parallel)
   * GET /api/v1/featured-pricing
   * GET /api/v1/platform-payment-methods
   */
  const fetchPricingAndMethods = useCallback(async () => {
    try {
      const [pricingRes, methodsRes] = await Promise.all([
        featuredPricingService.getPricing(),
        featuredPricingService.getPaymentMethods(),
      ]);
      setPricing(pricingRes.data);
      setPaymentMethods(methodsRes.data);
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل البيانات';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Fetch featured status for a specific announcement
   * GET /api/v1/user/announcements/{id}/featured-status
   */
  const fetchFeaturedStatus = useCallback(async (announcementId: number) => {
    try {
      const data = await featuredRequestService.getFeaturedStatus(announcementId);
      setStatus(data);
      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في تحميل حالة التمييز';
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Submit featured request
   * POST /api/v1/user/announcements/{id}/request-featured
   */
  const requestFeatured = useCallback(
    async (announcementId: number, payload: FeaturedRequestPayload) => {
      try {
        setLoading(true);
        const response = await featuredRequestService.requestFeatured(
          announcementId,
          payload
        );
        toast.success(response.message);
        return response;
      } catch (error: any) {
        const message = error.response?.data?.message || 'حدث خطأ في إرسال الطلب';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch my featured requests history
   * GET /api/v1/user/featured-requests
   */
  const fetchMyFeaturedRequests = useCallback(
    async (params?: { page?: number; per_page?: number }) => {
      try {
        setLoading(true);
        const response = await featuredRequestService.getMyFeaturedRequests(params);
        setRequests(response.data);
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

  return {
    loading,
    pricing,
    paymentMethods,
    status,
    requests,
    fetchPricingAndMethods,
    fetchFeaturedStatus,
    requestFeatured,
    fetchMyFeaturedRequests,
  };
};

export default useFeaturedRequest;