import { Router } from "express";
import recipeRouter from "./recipe.router";

const router = Router()
router.use('/recipes', recipeRouter)

export default router