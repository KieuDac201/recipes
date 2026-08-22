import cloudinary from "../config/cloudinary"
import { getAllUsedImageUrls } from "../repositories/recipe.repository"
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

export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url || typeof url !== "string") return null
    if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
      return null
    }

    // 1. Loại bỏ query parameters (ví dụ: ?_a=BAMAPqWQ0) và URL fragment hash (#...)
    const cleanUrl = url.split("?")[0].split("#")[0]
    const parts = cleanUrl.split("/upload/")
    if (parts.length < 2) return null

    let pathAfterUpload = parts[1]

    // 2. Nếu có version segment v\d+/ (ví dụ /v1/ hoặc /v1724321234/), mọi thứ phía sau CHÍNH XÁC là public_id
    const versionMatch = pathAfterUpload.match(/(?:^|\/)v\d+\/(.+)$/)
    if (versionMatch && versionMatch[1]) {
      pathAfterUpload = versionMatch[1]
    } else {
      // 3. Nếu không có version, loại bỏ các transformation segments (w_1200, f_auto, q_auto:good...)
      pathAfterUpload = pathAfterUpload.replace(/^(?:[a-zA-Z0-9_:,.-]+\/)*(?:v\d+\/)?/, "")
    }

    // 4. Bỏ phần mở rộng định dạng file (.jpg, .png, .webp...) nếu có
    return pathAfterUpload.replace(/\.[^/.]+$/, "")
  } catch {
    return null
  }
}

// Quét và xóa các ảnh trên Cloudinary nếu không còn tồn tại trong Database (> 24h)
export const cleanOrphanedImages = async (): Promise<void> => {
  try {
    console.log("[Cron Job] Checking for orphaned images on Cloudinary...")

    // 1. Lấy toàn bộ image_url trong Database trong 1 câu truy vấn duy nhất
    const allDbUrls = await getAllUsedImageUrls()
    const usedPublicIds = new Set<string>()

    for (const url of allDbUrls) {
      const publicId = extractPublicIdFromUrl(url)
      if (publicId) {
        usedPublicIds.add(publicId)
      }
    }

    console.log(`[Cron Job] Found ${usedPublicIds.size} active images in Database.`)

    // 2. Quét Cloudinary các ảnh trong folder 'recipes' đã tạo quá 24h (tránh xóa nhầm ảnh đang soạn thảo)
    let nextCursor: string | undefined = undefined
    let totalDeleted = 0

    do {
      const searchResult = await cloudinary.search
        .expression("created_at < 1d AND folder:recipes*")
        .max_results(100)
        .next_cursor(nextCursor)
        .execute()

      if (!searchResult.resources || searchResult.resources.length === 0) {
        break
      }

      const toDeleteIds: string[] = []

      for (const resource of searchResult.resources) {
        const publicId = resource.public_id
        // Nếu ảnh trên Cloudinary KHÔNG nằm trong danh sách đang dùng ở Database -> Xóa
        if (!usedPublicIds.has(publicId)) {
          toDeleteIds.push(publicId)
        }
      }

      // Xóa các ảnh mồ côi theo lô (batch tối đa 100 ảnh/request)
      if (toDeleteIds.length > 0) {
        await cloudinary.api.delete_resources(toDeleteIds)
        totalDeleted += toDeleteIds.length
        console.log(
          `[Cron Job] Successfully deleted ${toDeleteIds.length} orphaned images:`,
          toDeleteIds
        )
      }

      nextCursor = searchResult.next_cursor
    } while (nextCursor)

    console.log(`[Cron Job] Cleanup completed. Total deleted images: ${totalDeleted}`)
  } catch (error) {
    console.error("[Cron Job] Failed to clean orphaned images:", error)
  }
}
