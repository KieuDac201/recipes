import { Router } from "express";
import { cleanUpImages, uploadImage } from "../controllers/upload.controller";
import { uploadSingleImage } from "../middlewares/upload.middleware";
import "../schemas/upload.schema";

const router = Router();


router.post("/", uploadSingleImage, uploadImage);
router.post("/cleanup", cleanUpImages)


export default router;