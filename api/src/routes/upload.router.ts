import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { uploadSingleImage } from "../middlewares/upload.middleware";

const router = Router()

router.post('/', uploadSingleImage, uploadImage)

export default router