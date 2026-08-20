import { apiClient, ApiError } from "./apiClient";
import {
  GetRecipesParams,
  GetRecipesResponse,
  GetRecipeDetailResponse,
  RecipeDetail,
  Recipe,
  RecipeBody,
  CreateRecipeResponse,
} from "@/src/types/recipe";

/**
 * Recipe Service module for all Recipe-related API interactions
 */
export const recipeService = {
  /**
   * Fetch paginated list of public approved recipes (Home page)
   */
  getPublic: async (params?: GetRecipesParams): Promise<GetRecipesResponse> => {
    return apiClient.get<GetRecipesResponse>("/recipes", {
      params: {
        limit: params?.limit,
        current_page: params?.current_page,
        search: params?.search?.trim() || undefined,
      },
    });
  },

  /**
   * Alias for getPublic
   */
  getAll: async (params?: GetRecipesParams): Promise<GetRecipesResponse> => {
    return recipeService.getPublic(params);
  },

  /**
   * Fetch current authenticated user's recipes with optional status filter
   */
  getMyRecipes: async (params?: GetRecipesParams): Promise<GetRecipesResponse> => {
    return apiClient.get<GetRecipesResponse>("/recipes/my-recipes", {
      params: {
        limit: params?.limit,
        current_page: params?.current_page,
        search: params?.search?.trim() || undefined,
        status: params?.status || undefined,
      },
    });
  },

  /**
   * Fetch all recipes for admin dashboard with moderation status filter
   */
  getAdminRecipes: async (params?: GetRecipesParams): Promise<GetRecipesResponse> => {
    return apiClient.get<GetRecipesResponse>("/recipes/admin", {
      params: {
        limit: params?.limit,
        current_page: params?.current_page,
        search: params?.search?.trim() || undefined,
        status: params?.status || undefined,
      },
    });
  },

  /**
   * Fetch full recipe detail by numeric ID or slug
   */
  getByIdOrSlug: async (idOrSlug: string | number): Promise<RecipeDetail | null> => {
    try {
      const response = await apiClient.get<GetRecipeDetailResponse>(
        `/recipes/${encodeURIComponent(idOrSlug)}`
      );
      return response.data || null;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      console.error(`[recipeService.getByIdOrSlug] Error fetching recipe (${idOrSlug}):`, error);
      return null;
    }
  },

  /**
   * Create a new recipe with categories, ingredients, and instructions
   */
  create: async (payload: RecipeBody): Promise<Recipe> => {
    const response = await apiClient.post<CreateRecipeResponse>("/recipes", payload);
    return response.data;
  },

  /**
   * Update an existing recipe by ID
   */
  update: async (id: string | number, payload: RecipeBody): Promise<Recipe> => {
    const response = await apiClient.put<CreateRecipeResponse>(
      `/recipes/${encodeURIComponent(id)}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete a recipe by ID
   */
  delete: async (id: string | number): Promise<Recipe> => {
    const response = await apiClient.delete<CreateRecipeResponse>(
      `/recipes/${encodeURIComponent(id)}`
    );
    return response.data;
  },

  /**
   * Increment recipe view count by ID
   */
  increaseViewCount: async (id: string | number): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ success: boolean; data: { message: string } }>(
      `/recipes/${encodeURIComponent(id)}/view-count`
    );
    return response.data;
  },

  /**
   * Update recipe moderation status (Approve / Reject)
   */
  updateStatus: async (
    id: string | number,
    status: "pending" | "approved" | "rejected",
    rejection_reason?: string | null
  ): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ success: boolean; data: { message: string } }>(
      `/recipes/${encodeURIComponent(id)}/status`,
      { status, rejection_reason: rejection_reason || null }
    );
    return response.data;
  },
};

// Standalone function exports for convenient direct imports
export const getRecipes = recipeService.getAll;
export const getPublicRecipes = recipeService.getPublic;
export const getMyRecipes = recipeService.getMyRecipes;
export const getAdminRecipes = recipeService.getAdminRecipes;
export const getRecipeByIdOrSlug = recipeService.getByIdOrSlug;
export const createRecipe = recipeService.create;
export const updateRecipe = recipeService.update;
export const deleteRecipe = recipeService.delete;
export const updateRecipeStatus = recipeService.updateStatus;
export const increaseRecipeViewCount = recipeService.increaseViewCount;

export default recipeService;

