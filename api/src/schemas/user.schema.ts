import z from "zod";
import { registry } from "../docs/openapi";

const createUserSchema = registry.register("CreateUser", z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}))

type CreateUserSchemaType = z.infer<typeof createUserSchema>;

export { createUserSchema, CreateUserSchemaType }