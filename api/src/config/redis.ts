import "dotenv/config"
import { Redis } from "@upstash/redis"


const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

export const isRedisConfigured = Boolean(redisUrl && redisToken)

export const redis: Redis | null = isRedisConfigured
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null

export const REDIS_KEYS = {
  RECIPE_VIEWS: "recipe:views",
  RECIPE_VIEWS_SYNCING_PREFIX: "recipe:views:syncing",
  CATEGORIES_ALL: "categories:all",
  RECIPES_PUBLIC_PREFIX: "recipes:public",
} as const

/**
 * Increment recipe view count in Redis Hash
 */
export const incrementRecipeViewInRedis = async (
  recipeId: number,
  delta: number = 1
): Promise<number | null> => {
  if (!redis) {
    return null
  }
  return await redis.hincrby(REDIS_KEYS.RECIPE_VIEWS, recipeId.toString(), delta)
}

/**
 * Atomically prepare the current view counts for sync by renaming the hash key.
 * This ensures that any incoming views during the sync process are collected into a new hash
 * and won't be lost or overwritten.
 */
export const prepareViewCountsForSync = async (): Promise<{
  tempKey: string | null
  viewsMap: Record<string, number>
}> => {
  if (!redis) {
    return { tempKey: null, viewsMap: {} }
  }

  const exists = await redis.exists(REDIS_KEYS.RECIPE_VIEWS)
  if (!exists) {
    return { tempKey: null, viewsMap: {} }
  }

  const tempKey = `${REDIS_KEYS.RECIPE_VIEWS_SYNCING_PREFIX}:${Date.now()}`
  
  try {
    await redis.rename(REDIS_KEYS.RECIPE_VIEWS, tempKey)
  } catch (error) {
    console.error("Failed to rename Redis key for view count sync:", error)
    return { tempKey: null, viewsMap: {} }
  }

  const rawViews = await redis.hgetall<Record<string, number | string>>(tempKey)
  if (!rawViews || Object.keys(rawViews).length === 0) {
    await redis.del(tempKey)
    return { tempKey: null, viewsMap: {} }
  }

  const viewsMap: Record<string, number> = {}
  for (const [id, count] of Object.entries(rawViews)) {
    const numericCount = Number(count)
    if (!isNaN(numericCount) && numericCount > 0) {
      viewsMap[id] = numericCount
    }
  }

  return { tempKey, viewsMap }
}

/**
 * Remove the temporary sync key after DB update is successfully committed
 */
export const cleanupSyncKey = async (tempKey: string): Promise<void> => {
  if (!redis) return
  await redis.del(tempKey)
}
