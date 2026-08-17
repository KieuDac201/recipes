import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate";
import { createUserSchema } from "../schemas/user.schema";

const router = Router();

router.post("/", validateBody(createUserSchema), userController.createUser);
router.post("/login", validateBody(createUserSchema), userController.loginUser);

export default router;