import { useState, useCallback } from 'react';
import { helpRequestService } from '../services/helpRequestService';
import { toast } from 'react-toastify';
import type {
  HelpRequestPublic,
  HelpRequestsPublicResponse,
  HelpRequestUser,
  HelpRequestLimits,
  HelpRequestsUserResponse,
} from '../types';

type PublicMeta = HelpRequestsPublicResponse['meta'];
type UserMeta = HelpRequestsUserResponse['meta'];

/**
 * Public Help Requests list (paginated).
 * Used in: BasmaFundPage
 */
export const useHelpRequests = () => {
  const [requests, setRequests] = useState<HelpRequestPublic[]>([]);
  const [meta, setMeta] = useState<PublicMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(
    async (params?: { page?: number; per_page?: number }) => {
      try {
        setLoading(true);
        const response = await helpRequestService.getPublicList(params);
        setRequests(response.data);
        setMeta(response.meta);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'حدث خطأ في تحميل طلبات المساعدة';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    requests,
    meta,
    loading,
    fetchList,
  };
};

// ============================================
// USER — My Help Requests
// ============================================

/**
 * Owner's list of help requests.
 * Used in: MyHelpRequestsPage
 *
 * ✅ Now supports `sort` (newest | oldest | most_viewed)
 */
export const useMyHelpRequests = () => {
  const [requests, setRequests] = useState<HelpRequestUser[]>([]);
  const [meta, setMeta] = useState<UserMeta | null>(null);
  const [limits, setLimits] = useState<HelpRequestLimits | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMyList = useCallback(
    async (params?: {
      status?: 'all' | 'pending' | 'approved' | 'rejected' | 'archived';
      sort?: 'newest' | 'oldest' | 'most_viewed';
      search?: string;
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await helpRequestService.getMyList(params);
        setRequests(response.data);
        setMeta(response.meta);
        setLimits(response.limits);
        return response;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          'حدث خطأ في تحميل طلباتك';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    requests,
    meta,
    limits,
    loading,
    fetchMyList,
  };
};

export default useHelpRequests;