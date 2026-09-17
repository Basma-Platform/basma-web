import { useEffect, useState } from 'react';
import { publicStatsService } from '../services/publicStatsService';
import type { PublicStats } from '../services/publicStatsService';

/**
 * Hook for fetching public statistics
 * Used in: HeroSection, Statistics (About Us)
 *
 * Features:
 * - Auto fetch on mount
 * - Silent fallback (no toast on error - it's public data)
 * - Returns null on error (component shows fallback)
 */
export const usePublicStats = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    publicStatsService
      .getStats()
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, error };
};

export default usePublicStats;