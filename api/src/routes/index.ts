import { Router } from "express";
import recipeRouter from "./recipe.router";
import uploadRouter from "./upload.router";

const router = Router()
router.use('/recipes', recipeRouter)
router.use("/upload", uploadRouter)

export default router