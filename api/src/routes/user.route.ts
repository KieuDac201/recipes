import { Router } from "express"
import { userController } from "../controllers/user.controller"
import { validateBody } from "../middlewares/validate"
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/user.schema"

const router = Router()

router.post("/", validateBody(createUserSchema), userController.createUser)
router.post("/login", validateBody(createUserSchema), userController.loginUser)
router.post("/forgot-password", validateBody(forgotPasswordSchema), userController.forgotPassword)
router.post("/reset-password", validateBody(resetPasswordSchema), userController.resetPassword)

export default router
