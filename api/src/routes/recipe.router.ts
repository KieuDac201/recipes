import { Router } from "express";
import { getRecipes, getRecipe, createRecipe } from "../controllers/recipe.controller";
import { validateQuery, validateBody } from "../middlewares/validate";
import { createRecipePayloadSchema, getRecipesQuerySchema } from "../schemas/recipe.schema";

const router = Router();
router.get('/', validateQuery(getRecipesQuerySchema), getRecipes);
router.get('/:id', getRecipe);
router.post('/', validateBody(createRecipePayloadSchema), createRecipe);

export default router;