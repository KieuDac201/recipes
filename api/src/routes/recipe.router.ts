import { Router } from "express";
import RecipeController from "../controllers/recipe.controller";
import { validateQuery, validateBody } from "../middlewares/validate";
import { createRecipePayloadSchema, updateRecipePayloadSchema, getRecipesQuerySchema } from "../schemas/recipe.schema";
import { verifyToken, authAdmin } from "../middlewares/auth";

const router = Router();
router.get('/', validateQuery(getRecipesQuerySchema), RecipeController.getRecipes);
router.get('/:id', RecipeController.getRecipe);
router.post('/', verifyToken, validateBody(createRecipePayloadSchema), RecipeController.createRecipe);
router.put("/:id", verifyToken, authAdmin, validateBody(updateRecipePayloadSchema), RecipeController.updateRecipe);
router.delete('/:id', verifyToken, authAdmin, RecipeController.deleteRecipe);

export default router;