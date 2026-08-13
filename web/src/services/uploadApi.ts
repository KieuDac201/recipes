import { apiClient, ApiError } from "./apiClient";
import { UploadImageResponse, UploadImageData } from "@/src/types/recipe";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Validates image file size and type before sending to server
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: "Vui lòng chọn một tệp hình ảnh." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh định dạng JPEG, PNG, WebP hoặc GIF.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Kích thước ảnh vượt quá giới hạn 5MB. Vui lòng chọn ảnh nhỏ hơn.",
    };
  }

  return { valid: true };
};

/**
 * Uploads an image file to the backend API (/upload) which optimizes and saves to Cloudinary
 */
export const uploadImage = async (file: File): Promise<UploadImageData> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new ApiError(validation.error || "Tệp hình ảnh không hợp lệ", 400);
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post<UploadImageResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response || !response.data) {
      throw new ApiError("Phản hồi máy chủ không hợp lệ khi tải ảnh lên.", 500);
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("[uploadImage] Error uploading image:", error);
    throw new ApiError("Không thể tải ảnh lên. Vui lòng thử lại sau.", 500);
  }
};

export const uploadService = {
  uploadImage,
  validateImageFile,
};

export default uploadService;
