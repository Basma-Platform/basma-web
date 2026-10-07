import { useState, useEffect, useCallback } from 'react';
import { basmaFundPublicService } from '../services/basmaFundPublicService';
import { FUND_CONTACT_FALLBACK } from '../utils/fundContactHelpers';
import type { PlatformContactInfo } from '../types';

/**
 * Platform contact info (public).
 * Falls back to FUND_CONTACT_FALLBACK if API fails.
 * Used in: HelpRequestDetailsPage, InquirySuccessCard
 */
export const useDonationContact = () => {
  const [contact, setContact] = useState<PlatformContactInfo>(
    FUND_CONTACT_FALLBACK
  );
  const [loading, setLoading] = useState(true);

  const fetchContact = useCallback(async () => {
    try {
      setLoading(true);
      const response = await basmaFundPublicService.getContact();
      setContact(response.data);
      return response.data;
    } catch (error) {
      // Silent — keep fallback
      console.warn('Failed to load fund contact, using fallback:', error);
      return FUND_CONTACT_FALLBACK;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  return {
    contact,
    loading,
    fetchContact,
  };
};

export default useDonationContact;