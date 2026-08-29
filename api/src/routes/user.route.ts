import { Router } from "express"
import { userController } from "../controllers/user.controller"
import { validateBody } from "../middlewares/validate"
import {
  createUserSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema,
  facebookLoginSchema,
} from "../schemas/user.schema"

const router = Router()

router.post("/", validateBody(createUserSchema), userController.createUser)
router.post("/verify-email", validateBody(verifyEmailSchema), userController.verifyEmail)
router.get("/verify-email", userController.verifyEmail)
router.post(
  "/resend-verification",
  validateBody(resendVerificationSchema),
  userController.resendVerification
)
router.post("/login", validateBody(createUserSchema), userController.loginUser)
router.post("/oauth/google", validateBody(googleLoginSchema), userController.googleLogin)
router.post("/oauth/facebook", validateBody(facebookLoginSchema), userController.facebookLogin)
router.post("/forgot-password", validateBody(forgotPasswordSchema), userController.forgotPassword)
router.post("/reset-password", validateBody(resetPasswordSchema), userController.resetPassword)

export default router
