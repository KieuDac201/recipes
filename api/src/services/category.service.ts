import { redis, REDIS_KEYS } from "../config/redis"
import { categoryRepository } from "../repositories/category.repository"
import { Category, CreateCategoryBody, UpdateCategoryBody } from "../types/category.type"
import { AppError } from "../utils/AppError"
import { slugify } from "../utils/slug"

// Cache TTL: 24 hours (in seconds)
const CATEGORIES_CACHE_TTL = 24 * 60 * 60

/**
 * Safely invalidate categories cache in Redis
 */
const invalidateCategoriesCache = async (): Promise<void> => {
  if (!redis) return
  try {
    await redis.del(REDIS_KEYS.CATEGORIES_ALL)
  } catch (error) {
    console.error("⚠️ Failed to invalidate categories cache in Redis:", error)
  }
}

const findAllCategories = async (): Promise<Category[]> => {
  // 1. Check Redis Cache first (Cache-Aside pattern)
  if (redis) {
    try {
      const cached = await redis.get<Category[]>(REDIS_KEYS.CATEGORIES_ALL)
      if (cached) {
        return cached
      }
    } catch (error) {
      console.error("⚠️ Failed to read categories from Redis cache:", error)
    }
  }

  // 2. Cache Miss: Query from PostgreSQL Database
  const categories = await categoryRepository.findAllCategories()

  // 3. Populate Redis Cache asynchronously or synchronously with TTL
  if (redis && categories.length > 0) {
    redis
      .set(REDIS_KEYS.CATEGORIES_ALL, categories, { ex: CATEGORIES_CACHE_TTL })
      .catch((error) => {
        console.error("⚠️ Failed to save categories to Redis cache in background:", error)
      })
  }

  return categories
}

const createCategory = async (data: CreateCategoryBody): Promise<Category> => {
  const name = data.name.trim()
  const slug = data.slug?.trim() || slugify(name)

  const existing = await categoryRepository.findCategoryByNameOrSlug(name, slug)
  if (existing) {
    if (existing.name.toLowerCase() === name.toLowerCase()) {
      throw new AppError("Category with this name already exists", 400)
    }
    if (existing.slug === slug) {
      throw new AppError("Category with this slug already exists", 400)
    }
  }

  const created = await categoryRepository.createCategory({ name, slug })

  // Invalidate cache after creating a new category
  invalidateCategoriesCache()

  return created
}

const updateCategory = async (id: number, data: UpdateCategoryBody): Promise<Category> => {
  const updated = await categoryRepository.updateCategory(id, data)
  if (!updated) {
    throw new AppError("Category not found", 404)
  }

  // Invalidate cache after updating a category
  invalidateCategoriesCache()

  return updated
}

const deleteCategory = async (id: number): Promise<Category> => {
  const deleted = await categoryRepository.deleteCategory(id)
  if (!deleted) {
    throw new AppError("Category not found", 404)
  }

  // Invalidate cache after deleting a category
  await invalidateCategoriesCache()

  return deleted
}

export const categoryService = {
  findAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}
