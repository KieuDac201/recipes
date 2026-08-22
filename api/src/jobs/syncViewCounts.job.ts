import cron from "node-cron"
import {
  isRedisConfigured,
  prepareViewCountsForSync,
  cleanupSyncKey,
} from "../config/redis"
import * as RecipeRepository from "../repositories/recipe.repository"

/**
 * Execute the synchronization of recipe view counts from Redis to PostgreSQL
 */
export const syncViewCountsNow = async (): Promise<{
  syncedRecipesCount: number
  totalViewsCount: number
}> => {
  if (!isRedisConfigured) {
    console.log("ℹ️ View count sync skipped: Redis is not configured.")
    return { syncedRecipesCount: 0, totalViewsCount: 0 }
  }

  try {
    const { tempKey, viewsMap } = await prepareViewCountsForSync()

    if (!tempKey || Object.keys(viewsMap).length === 0) {
      return { syncedRecipesCount: 0, totalViewsCount: 0 }
    }

    const entries = Object.entries(viewsMap).map(([idStr, views]) => ({
      id: Number(idStr),
      views,
    }))

    const totalViews = entries.reduce((acc, curr) => acc + curr.views, 0)
    console.log(
      `🔄 Syncing view counts for ${entries.length} recipes (${totalViews} total views) to database...`
    )

    // Execute batch update in a PostgreSQL database transaction
    await RecipeRepository.batchIncrementRecipeViewCounts(entries)

    // Cleanup the temporary key in Redis only after DB commit succeeded
    await cleanupSyncKey(tempKey)

    console.log(
      `✅ Successfully synced view counts for ${entries.length} recipes (${totalViews} views) into PostgreSQL.`
    )

    return {
      syncedRecipesCount: entries.length,
      totalViewsCount: totalViews,
    }
  } catch (error) {
    console.error("❌ Error while syncing view counts from Redis to database:", error)
    throw error
  }
}

/**
 * Initialize the view count sync cron job to run every 30 minutes
 */
export const initViewCountSyncJob = (): cron.ScheduledTask => {
  // Cron format: */30 * * * * -> At every 30th minute
  const task = cron.schedule("*/30 * * * *", async () => {
    console.log("⏰ Running scheduled 30-minute recipe view count sync job...")
    try {
      await syncViewCountsNow()
    } catch (error) {
      console.error("❌ Scheduled view count sync failed:", error)
    }
  })

  console.log("🕒 View count sync cron job scheduled to run every 30 minutes (*/30 * * * *).")
  return task
}
