import cloudinary from "../config/cloudinary"
import { isImageUsedInRecipe } from "../repositories/recipe.repository"
import { AppError } from "../utils/AppError"

interface UploadResponse {
  url: string
  publicId: string
}

export const uploadImageToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        tags: ["temporary"],
        transformation: [
          {
            width: 1200,
            crop: "limit",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError("Upload failed", 500))
          return
        }

        const optimizeUrl = cloudinary.url(result.public_id, {
          secure: true,
          fetch_format: "auto",
          quality: "auto:good",
        })

        resolve({
          url: optimizeUrl,
          publicId: result.public_id,
        })
      }
    )
    uploadStream.end(fileBuffer)
  })
}

export const confirmImages = async (publicIds: string[]): Promise<void> => {
  if (!publicIds || publicIds.length === 0) return

  try {
    await cloudinary.uploader.remove_tag("temporary", publicIds)
  } catch (error) {
    console.error("Failed to remove temporary tag from images:", error)
  }
}

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split("/upload/")
    if (parts.length < 2) return null
    // Bỏ qua các transformation và version (v123456/)
    const pathAfterUpload = parts[1].replace(/^(?:[a-zA-Z0-9_:,]+\/)*(?:v\d+\/)?/, "")
    // Bỏ phần mở rộng (.jpg, .png, ...)
    return pathAfterUpload.replace(/\.[^/.]+$/, "")
  } catch {
    return null
  }
}

// 4. Quét và xóa các ảnh "temporary" quá 24h
export const cleanOrphanedImages = async (): Promise<void> => {
  try {
    console.log("[Cron Job] Checking for orphaned temporary images...")

    // Quét các ảnh có tag temporary quá 24h
    const searchResult = await cloudinary.search
      .expression("tags:temporary AND created_at < 1d")
      .max_results(100)
      .execute()
    if (!searchResult.resources || searchResult.resources.length === 0) {
      console.log("[Cron Job] No orphaned images found.")
      return
    }
    const toDeleteIds: string[] = []
    const toHealIds: string[] = []
    // Kiểm tra từng ảnh với Database
    for (const resource of searchResult.resources) {
      const publicId = resource.public_id
      const isUsed = await isImageUsedInRecipe(publicId)
      if (isUsed) {
        // ⚠️ Ảnh đang có trong Recipe DB nhưng bị sót tag do lỗi mạng trước đó
        toHealIds.push(publicId)
      } else {
        //  Ảnh không hề có trong DB -> Xóa
        toDeleteIds.push(publicId)
      }
    }
    // Tự động sửa lỗi: gỡ tag temporary cho các ảnh đang được dùng
    if (toHealIds.length > 0) {
      await cloudinary.uploader.remove_tag("temporary", toHealIds)
      console.log(
        `[Cron Job] Healed & kept ${toHealIds.length} images that exist in Database:`,
        toHealIds
      )
    }
    // Xóa các ảnh mồ côi thực sự
    if (toDeleteIds.length > 0) {
      await cloudinary.api.delete_resources(toDeleteIds)
      console.log(
        `[Cron Job] Successfully deleted ${toDeleteIds.length} truly orphaned images:`,
        toDeleteIds
      )
    }
  } catch (error) {
    console.error("[Cron Job] Failed to clean orphaned images:", error)
  }
}
