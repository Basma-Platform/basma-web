import { useState, useCallback, useEffect, useRef } from 'react';
import { communityService } from '../services/communityService';
import type { CommunityPublicStats } from '../types';

/**
 * Fetch public community statistics.
 *
 * Used in:
 *  - CommunityPage (StatsStrip)
 *
 * Silent failures — stats are non-critical.
 */
export const useCommunityStats = () => {
  const [stats, setStats] = useState<CommunityPublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (fetchedRef.current) return stats;

    try {
      setLoading(true);
      const data = await communityService.getPublicStats();
      setStats(data);
      fetchedRef.current = true;
      return data;
    } catch (error) {
      // Silent — component will show fallback
      console.warn('Failed to load community stats:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stats,
    loading,
    fetchStats,
  };
};

export default useCommunityStats;