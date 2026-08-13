import { Router } from "express";
import RecipeController from "../controllers/recipe.controller";
import { validateQuery, validateBody } from "../middlewares/validate";
import { createRecipePayloadSchema, updateRecipePayloadSchema, getRecipesQuerySchema } from "../schemas/recipe.schema";

const router = Router();
router.get('/', validateQuery(getRecipesQuerySchema), RecipeController.getRecipes);
router.get('/:id', RecipeController.getRecipe);
router.post('/', validateBody(createRecipePayloadSchema), RecipeController.createRecipe);
router.put("/:id", validateBody(updateRecipePayloadSchema), RecipeController.updateRecipe);
router.delete('/:id', RecipeController.deleteRecipe);

export default router;