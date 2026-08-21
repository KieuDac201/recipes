import { apiClient } from "./apiClient";
import { Category, ApiResponse } from "@/src/types/recipe";

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
}

export const categoryService = {
  /**
   * Fetch all categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>("/categories");
      return response.data || [];
    } catch (error) {
      console.error("[categoryService.getAll] Error fetching categories:", error);
      return [];
    }
  },

  /**
   * Create a new category (admin only)
   */
  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>("/categories", payload);
    return response.data;
  },

  /**
   * Update category by ID (admin only)
   */
  update: async (id: number, payload: UpdateCategoryPayload): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return response.data;
  },

  /**
   * Delete category by ID (admin only)
   */
  delete: async (id: number): Promise<Category> => {
    const response = await apiClient.delete<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
};

export const getCategories = categoryService.getAll;
export const createCategory = categoryService.create;
export const updateCategory = categoryService.update;
export const deleteCategory = categoryService.delete;

export default categoryService;

