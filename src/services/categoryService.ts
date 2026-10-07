import api from './api';
import type { Category, CategoriesResponse, CategoryResponse } from '../types';

export const categoryService = {
  /**
   * GET /api/v1/categories
   * Get all active categories (public)
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse>('/v1/categories');
    return response.data.data;
  },

  /**
   * GET /api/v1/categories/{id}
   * Get single category details
   */
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get<CategoryResponse>(`/v1/categories/${id}`);
    return response.data.data;
  },
};

export default categoryService;