import * as RecipeRepository from "../repositories/recipe.repository"
import { incrementRecipeViewInRedis, isRedisConfigured, redis, REDIS_KEYS } from "../config/redis"
import { Recipe, RecipeBody, RecipeDetail, RecipeSortBy, RecipeStatus } from "../types/recipe.type"
import { User } from "../types/user.type"
import { AppError } from "../utils/AppError"
import { SortOrder } from "../types"

// Public recipes list cache TTL: 10 minutes (in seconds)
const PUBLIC_RECIPES_CACHE_TTL = 10 * 60

/**
 * Safely invalidate all public recipes list cache in Redis (fire-and-forget safe)
 */
export const invalidatePublicRecipesCache = async (): Promise<void> => {
  if (!redis) return
  try {
    const keys = await redis.keys(`${REDIS_KEYS.RECIPES_PUBLIC_PREFIX}:*`)
    if (keys && keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("⚠️ Failed to invalidate public recipes cache in Redis:", error)
  }
}

const getMyRecipes = async (
  limit: number,
  currentPage: number,
  search?: string,
  status?: RecipeStatus,
  authorId?: number
): Promise<{ recipes: Recipe[]; totalPage: number }> => {
  const offset = (currentPage - 1) * limit

  return await RecipeRepository.findAllRecipes({
    limit,
    offset,
    search,
    status: status || "all",
    authorId,
    sortBy: "created_at",
    sortOrder: "desc",
    includeDeleted: true,
  })
}

const getAdminRecipes = async (
  limit: number,
  currentPage: number,
  search?: string,
  status?: RecipeStatus,
  authorId?: number
): Promise<{ recipes: Recipe[]; totalPage: number; totalCount: number }> => {
  const offset = (currentPage - 1) * limit
  return await RecipeRepository.findAllRecipes({
    limit,
    offset,
    search,
    status,
    authorId,
    sortBy: "created_at",
    sortOrder: "desc",
    includeDeleted: true,
  })
}

const getPublicRecipes = async ({
  limit,
  currentPage,
  search,
  sortBy,
  sortOrder,
  categories,
}: {
  limit: number
  currentPage: number
  search?: string
  sortBy: RecipeSortBy
  sortOrder: SortOrder
  categories?: string[]
}): Promise<{ recipes: Recipe[]; totalPage: number }> => {
  const normalizedSearch = search ? search.toLowerCase().trim() : ""
  const normalizedCategories =
    categories && categories.length > 0 ? categories.slice().sort().join(",") : ""

  const cacheKey = `${REDIS_KEYS.RECIPES_PUBLIC_PREFIX}:p=${currentPage}:l=${limit}:s=${normalizedSearch}:sb=${sortBy}:so=${sortOrder}:c=${normalizedCategories}`

  // 1. Check Redis Cache first (Cache-Aside pattern)
  if (redis) {
    try {
      const cached = await redis.get<{ recipes: Recipe[]; totalPage: number }>(cacheKey)
      if (cached) {
        return cached
      }
    } catch (error) {
      console.error("⚠️ Failed to read public recipes from Redis cache:", error)
    }
  }

  // 2. Cache Miss: Query Database
  const offset = (currentPage - 1) * limit
  const result = await RecipeRepository.findAllRecipes({
    limit,
    offset,
    search,
    status: "approved",
    sortBy,
    sortOrder,
    categories,
  })
  const responseData = { recipes: result.recipes, totalPage: result.totalPage }

  // 3. Populate Redis Cache in background (Fire-and-forget, TTL: 10 minutes)
  if (redis) {
    redis.set(cacheKey, responseData, { ex: PUBLIC_RECIPES_CACHE_TTL }).catch((error) => {
      console.error("⚠️ Failed to save public recipes to Redis cache in background:", error)
    })
  }

  return responseData
}

const getRecipeById = async (id: string): Promise<RecipeDetail> => {
  const recipe = await RecipeRepository.findRecipeById(id)

  if (!recipe) {
    throw new AppError("Not Found", 404)
  }
  return recipe
}

const postRecipe = async (recipe: RecipeBody): Promise<Recipe> => {
  const created = await RecipeRepository.createRecipe(recipe)
  invalidatePublicRecipesCache()
  return created
}

const updateRecipe = async (
  id: string,
  recipe: RecipeBody,
  user?: User
): Promise<Omit<Recipe, "created_at">> => {
  const existingRecipe = await RecipeRepository.findRecipeById(id)
  if (!existingRecipe) {
    throw new AppError("Not Found", 404)
  }

  if (user && user.role !== "admin" && existingRecipe.author_id !== user.id) {
    throw new AppError("Forbidden: Bạn không có quyền chỉnh sửa công thức này.", 403)
  }

  const updated = await RecipeRepository.updateRecipe(id, recipe)
  invalidatePublicRecipesCache()
  return updated
}

const removeRecipe = async (id: string): Promise<Recipe> => {
  const deletedRecipe = await RecipeRepository.deleteRecipe(id)

  if (!deletedRecipe) {
    throw new AppError("Not Found", 404)
  }

  invalidatePublicRecipesCache()
  return deletedRecipe
}

const restoreRecipe = async (id: string): Promise<Recipe> => {
  const restoredRecipe = await RecipeRepository.restoreRecipe(id)

  if (!restoredRecipe) {
    throw new AppError("Not Found", 404)
  }

  invalidatePublicRecipesCache()
  return restoredRecipe
}

const updateRecipeStatus = async (id: number, status: RecipeStatus, rejection_reason?: string) => {
  await RecipeRepository.updateRecipeStatus(id, status, rejection_reason)
  invalidatePublicRecipesCache()
}

const increaseViewCount = async (id: number) => {
  if (isRedisConfigured) {
    try {
      await incrementRecipeViewInRedis(id)
      return
    } catch (error) {
      console.warn("⚠️ Redis increment failed, falling back to direct DB update:", error)
    }
  }

  // Direct database fallback if Redis is not configured or fails
  await RecipeRepository.increaseRecipeViewCount(id)
}

const RecipeService = {
  getMyRecipes,
  getPublicRecipes,
  getAdminRecipes,
  getRecipeById,
  postRecipe,
  updateRecipe,
  removeRecipe,
  restoreRecipe,
  updateRecipeStatus,
  increaseViewCount,
}

export default RecipeService
