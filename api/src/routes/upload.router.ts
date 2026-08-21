import { Router } from "express"
import { cleanUpImages, uploadImage } from "../controllers/upload.controller"
import { uploadSingleImage } from "../middlewares/upload.middleware"
import "../schemas/upload.schema"
import { verifyToken } from "../middlewares/auth"

const router = Router()

router.use(verifyToken)

router.post("/", uploadSingleImage, uploadImage)
router.post("/cleanup", cleanUpImages)

export default router
