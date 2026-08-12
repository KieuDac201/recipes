import { apiClient, ApiError } from "./apiClient";
import {
  GetRecipesParams,
  GetRecipesResponse,
  GetRecipeDetailResponse,
  RecipeDetail,
} from "@/src/types/recipe";

/**
 * Recipe Service module for all Recipe-related API interactions
 */
export const recipeService = {
  /**
   * Fetch paginated list of recipes with optional search keyword
   */
  getAll: async (params?: GetRecipesParams): Promise<GetRecipesResponse> => {
    return apiClient.get<GetRecipesResponse>("/recipes", {
      params: {
        limit: params?.limit,
        current_page: params?.current_page,
        search: params?.search?.trim() || undefined,
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
};

// Standalone function exports for convenient direct imports
export const getRecipes = recipeService.getAll;
export const getRecipeByIdOrSlug = recipeService.getByIdOrSlug;

export default recipeService;
