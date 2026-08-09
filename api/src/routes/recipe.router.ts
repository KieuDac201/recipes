import { Router } from "express";
import { getRecipes } from "../controllers/recipe.controller";
import validateQuery from "../middlewares/validate";
import { getRecipesQuerySchema } from "../schemas/recipe.schema";

const router = Router()
router.get('/', validateQuery(getRecipesQuerySchema), getRecipes)

export default router