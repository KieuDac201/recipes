import { Router } from "express"
import RecipeController from "../controllers/recipe.controller"
import { validateQuery, validateBody } from "../middlewares/validate"
import {
  createRecipePayloadSchema,
  updateRecipePayloadSchema,
  getPublicRecipesQuerySchema,
  getMyRecipesQuerySchema,
  getAdminRecipesQuerySchema,
  updateRecipeStatusSchema,
} from "../schemas/recipe.schema"
import { verifyToken, authAdmin } from "../middlewares/auth"

const router = Router()
router.get("/", validateQuery(getPublicRecipesQuerySchema), RecipeController.getPublicRecipes)
router.get(
  "/my-recipes",
  verifyToken,
  validateQuery(getMyRecipesQuerySchema),
  RecipeController.getMyRecipes
)
router.get(
  "/admin",
  verifyToken,
  authAdmin,
  validateQuery(getAdminRecipesQuerySchema),
  RecipeController.getAdminRecipes
)
router.get("/:id", RecipeController.getRecipe)
router.post(
  "/",
  verifyToken,
  validateBody(createRecipePayloadSchema),
  RecipeController.createRecipe
)
router.put(
  "/:id",
  verifyToken,
  validateBody(updateRecipePayloadSchema),
  RecipeController.updateRecipe
)
router.delete("/:id", verifyToken, authAdmin, RecipeController.deleteRecipe)
router.patch("/:id/restore", verifyToken, authAdmin, RecipeController.restoreRecipe)
router.patch(
  "/:id/status",
  verifyToken,
  authAdmin,
  validateBody(updateRecipeStatusSchema),
  RecipeController.updateRecipeStatus
)
router.patch("/:id/view-count", RecipeController.increaseViewCount)

export default router
