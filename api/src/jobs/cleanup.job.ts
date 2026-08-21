import cron from "node-cron"
import { cleanOrphanedImages } from "../services/upload.service"

export const initCleanupJob = () => {
  // Chạy mỗi ngày một lần vào lúc 00:00 (nửa đêm)
  cron.schedule("0 0 * * *", async () => {
    await cleanOrphanedImages()
  })

  console.log("Cleanup cron job scheduled (runs daily at 00:00)")
}
