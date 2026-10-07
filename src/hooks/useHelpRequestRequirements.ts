import { useState, useCallback, useEffect, useRef } from 'react';
import { helpRequestService } from '../services/helpRequestService';
import type { HelpRequestRequirements } from '../types';

/**
 * Fetch help-request requirements once (cached in state).
 * Used in: CreateHelpRequestPage
 */
export const useHelpRequestRequirements = () => {
  const [requirements, setRequirements] =
    useState<HelpRequestRequirements | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchedRef = useRef(false);

  const fetchRequirements = useCallback(async () => {
    if (fetchedRef.current && requirements) return requirements;

    try {
      setLoading(true);
      const data = await helpRequestService.getRequirements();
      setRequirements(data);
      fetchedRef.current = true;
      return data;
    } catch (error: any) {
      // Silent — create page shows defaults if this fails
      console.warn('Failed to load help request requirements:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [requirements]);

  useEffect(() => {
    fetchRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    requirements,
    loading,
    fetchRequirements,
  };
};

export default useHelpRequestRequirements;