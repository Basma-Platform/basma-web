import api from './api';
import type { Governorate, City } from '../types';

export const regionService = {
  // Get all governorates
  getGovernorates: async () => {
    const response = await api.get<Governorate[]>('/v1/governorates');
    return response.data;
  },

  // Get cities by governorate
  getCities: async (governorateId: number) => {
    const response = await api.get<City[]>(`/v1/governorates/${governorateId}/cities`);
    return response.data;
  },
};