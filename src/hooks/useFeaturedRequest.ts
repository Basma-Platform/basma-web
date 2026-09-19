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

export const useFeaturedRequest = () => {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<FeaturedPricing[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<
    PlatformPaymentMethod[]
  >([]);
  const [status, setStatus] = useState<FeaturedStatusResponse | null>(null);
  const [requests, setRequests] = useState<FeaturedRequest[]>([]);

  /**
   * Fetch pricing + payment methods (in parallel)
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
   */
  const fetchFeaturedStatus = useCallback(async (announcementId: number) => {
    try {
      const data =
        await featuredRequestService.getFeaturedStatus(announcementId);
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
   * Submit featured request.
   *
   * ✅ Returns the full backend response so the caller can navigate
   *    to the newly created request's detail page using `response.request.id`.
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
        return response; // ← full response: { message, request, next_steps }
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'حدث خطأ في إرسال الطلب';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Fetch my featured requests history (paginated)
   */
  const fetchMyFeaturedRequests = useCallback(
    async (params?: { page?: number; per_page?: number }) => {
      try {
        setLoading(true);
        const response =
          await featuredRequestService.getMyFeaturedRequests(params);
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