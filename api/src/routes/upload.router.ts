import { Router } from "express"
import { cleanUpImages, uploadImage } from "../controllers/upload.controller"
import { uploadSingleImage } from "../middlewares/upload.middleware"
import "../schemas/upload.schema"
import { verifyToken, verifyCronSecret } from "../middlewares/auth"

const router = Router()

// Upload ảnh: Cần xác thực người dùng đăng nhập (JWT token)
router.post("/", verifyToken, uploadSingleImage, uploadImage)

// Dọn dẹp ảnh mồ côi: Cần secret key (CRON_SECRET) cho GitHub Actions / Cron runners
router.post("/cleanup", verifyCronSecret, cleanUpImages)

export default router
