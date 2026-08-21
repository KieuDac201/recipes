import { Router } from "express"
import recipeRouter from "./recipe.router"
import uploadRouter from "./upload.router"
import userRouter from "./user.route"

const router = Router()
router.use("/recipes", recipeRouter)
router.use("/upload", uploadRouter)
router.use("/users", userRouter)

export default router
