import cron, { ScheduledTask } from "node-cron"
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
  durationMs: number
}> => {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  if (!isRedisConfigured) {
    console.log(`[${timestamp}] [CRON:ViewCountSync] ℹ️ Skipped: Redis is not configured.`)
    return { syncedRecipesCount: 0, totalViewsCount: 0, durationMs: Date.now() - startTime }
  }

  try {
    const { tempKey, viewsMap } = await prepareViewCountsForSync()

    if (!tempKey || Object.keys(viewsMap).length === 0) {
      const duration = Date.now() - startTime
      console.log(
        `[${timestamp}] [CRON:ViewCountSync] ℹ️ Completed (no pending view counts to sync) in ${duration}ms.`
      )
      return { syncedRecipesCount: 0, totalViewsCount: 0, durationMs: duration }
    }

    const entries = Object.entries(viewsMap).map(([idStr, views]) => ({
      id: Number(idStr),
      views,
    }))

    const totalViews = entries.reduce((acc, curr) => acc + curr.views, 0)
    console.log(
      `[${timestamp}] [CRON:ViewCountSync] 🔄 Syncing ${entries.length} recipes (${totalViews} total views) to database...`
    )

    // Execute batch update in a PostgreSQL database transaction
    await RecipeRepository.batchIncrementRecipeViewCounts(entries)

    // Cleanup the temporary key in Redis only after DB commit succeeded
    await cleanupSyncKey(tempKey)

    const duration = Date.now() - startTime
    console.log(
      `[${new Date().toISOString()}] [CRON:ViewCountSync] ✅ Successfully synced ${entries.length} recipes (${totalViews} views) to PostgreSQL in ${duration}ms.`
    )

    return {
      syncedRecipesCount: entries.length,
      totalViewsCount: totalViews,
      durationMs: duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(
      `[${new Date().toISOString()}] [CRON:ViewCountSync] ❌ Error syncing view counts after ${duration}ms:`,
      error
    )
    throw error
  }
}

/**
 * Initialize the view count sync cron job to run every 30 minutes
 */
export const initViewCountSyncJob = (): ScheduledTask => {
  // Cron format: */30 * * * * -> At every 30th minute
  const task = cron.schedule("*/30 * * * *", async () => {
    const startTime = new Date().toISOString()
    console.log(`[${startTime}] [CRON:ViewCountSync] ⏰ Started scheduled 30-minute sync job...`)
    try {
      await syncViewCountsNow()
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] [CRON:ViewCountSync] ❌ Scheduled sync job failed:`,
        error
      )
    }
  })

  console.log(
    `[${new Date().toISOString()}] [CRON:ViewCountSync] 🕒 Job scheduled to run every 30 minutes (*/30 * * * *).`
  )
  return task
}
