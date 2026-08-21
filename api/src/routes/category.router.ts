import { Router } from "express"
import { categoryController } from "../controllers/category.controller"
import {
  createCategoryPayloadSchema,
  updateCategoryPayloadSchema,
} from "../schemas/category.schema"
import { validateBody } from "../middlewares/validate"
import { verifyToken, authAdmin } from "../middlewares/auth"

const router = Router()

router.get("/", categoryController.getAllCategories)
router.post(
  "/",
  verifyToken,
  authAdmin,
  validateBody(createCategoryPayloadSchema),
  categoryController.createCategory
)
router.put(
  "/:id",
  verifyToken,
  authAdmin,
  validateBody(updateCategoryPayloadSchema),
  categoryController.updateCategory
)
router.delete("/:id", verifyToken, authAdmin, categoryController.deleteCategory)

export const categoryRouter = router


