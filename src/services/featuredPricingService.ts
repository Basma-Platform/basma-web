import api from './api';
import type { FeaturedPricing, PlatformPaymentMethod } from '../types';

export const featuredPricingService = {
  /**
   * GET /api/v1/featured-pricing
   * Get available featured durations and prices (public)
   */
  getPricing: async () => {
    const response = await api.get<{ data: FeaturedPricing[] }>(
      '/v1/featured-pricing'
    );
    return response.data;
  },

  /**
   * GET /api/v1/platform-payment-methods
   * Get available platform payment methods (auth required)
   */
  getPaymentMethods: async () => {
    const response = await api.get<{ data: PlatformPaymentMethod[] }>(
      '/v1/platform-payment-methods'
    );
    return response.data;
  },
};

export default featuredPricingService;