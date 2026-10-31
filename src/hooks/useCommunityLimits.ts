import { useState, useCallback, useEffect, useRef } from 'react';
import { communityService } from '../services/communityService';
import { toast } from 'react-toastify';
import type { CommunityLimitsResponse } from '../types';

/**
 * Fetch Community Post limits + options for the Create page.
 *
 * Used in:
 *  - CreateCommunityPostPage (on mount)
 *
 * Returns types, display options, expiry options, and current limits.
 */
export const useCommunityLimits = () => {
  const [data, setData] = useState<CommunityLimitsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchLimits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityService.getLimits();
      if (!isMountedRef.current) return;

      setData(response);
      return response;
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const status = err.response?.status;
      const message =
        err.response?.data?.message || 'حدث خطأ في تحميل البيانات';

      setError(message);

      // 403 — not verified (show toast, page will handle redirect)
      if (status === 403) {
        toast.error(message);
      } else {
        toast.error(message);
      }
      throw err;
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]);

  return {
    data,
    loading,
    error,
    fetchLimits,
  };
};

export default useCommunityLimits;