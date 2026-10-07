import { useState, useCallback } from 'react';
import { adminHelpRequestService } from '../services/adminHelpRequestService';
import { toast } from 'react-toastify';
import type {
  AdminHelpRequestListItem,
  AdminHelpRequestStats,
  AdminHelpRequestsListResponse,
} from '../types';

type PaginationMeta = AdminHelpRequestsListResponse['meta'];

/**
 * Admin help-requests list + stats.
 * Used in: AdminHelpRequestsListPage
 */
export const useAdminHelpRequests = () => {
  const [requests, setRequests] = useState<AdminHelpRequestListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [stats, setStats] = useState<AdminHelpRequestStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchList = useCallback(
    async (params?: {
      status?: 'all' | 'pending' | 'approved' | 'rejected' | 'archived';
      search?: string;
      sort?: 'newest' | 'oldest' | 'most_viewed';
      page?: number;
      per_page?: number;
    }) => {
      try {
        setLoading(true);
        const response = await adminHelpRequestService.getList(params);
        setRequests(response.data);
        setMeta(response.meta);
        setStats(response.stats);
        return response;
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'حدث خطأ في تحميل الطلبات'
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await adminHelpRequestService.getStats();
      setStats(data);
      return data;
    } catch (error: any) {
      console.warn('Failed to load help request stats:', error);
      throw error;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  return {
    requests,
    meta,
    stats,
    loading,
    statsLoading,
    fetchList,
    fetchStats,
  };
};

export default useAdminHelpRequests;