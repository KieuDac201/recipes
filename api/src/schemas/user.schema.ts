import { z } from "zod";
import { registry, ErrorResponseSchema } from "../docs/openapi";

// Schema for user registration and login request payload
export const CreateUserSchema = registry.register(
    "CreateUser",
    z.object({
        email: z.string().email("Invalid email format").openapi({
            example: "user@example.com",
            description: "User email address",
        }),
        password: z.string().min(6, "Password must be at least 6 characters long").openapi({
            example: "securePassword123",
            description: "User password (minimum 6 characters)",
        }),
    })
);

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

// Alias for backwards compatibility
export const createUserSchema = CreateUserSchema;

// User Profile Schema
export const UserProfileSchema = registry.register(
    "UserProfile",
    z.object({
        id: z.number().int().optional().openapi({ example: 1 }),
        email: z.string().email().openapi({ example: "user@example.com" }),
        role: z.string().openapi({ example: "user" }),
        created_at: z.union([z.string(), z.date()]).optional().openapi({
            example: "2026-08-17T05:00:00.000Z",
        }),
    })
);

// Response Schema for User Registration (POST /users)
export const CreateUserResponseSchema = registry.register(
    "CreateUserResponse",
    z.object({
        message: z.string().openapi({ example: "User created successfully" }),
        user: UserProfileSchema,
    })
);

// Response Schema for User Login (POST /users/login)
export const LoginUserResponseSchema = registry.register(
    "LoginUserResponse",
    z.object({
        message: z.string().openapi({ example: "User logged in successfully" }),
        user: z.object({
            user: z.object({
                email: z.string().email().openapi({ example: "user@example.com" }),
                role: z.string().openapi({ example: "user" }),
            }),
            token: z.string().openapi({
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9...",
                description: "JWT access token valid for 1 day",
            }),
        }),
    })
);

// Register OpenAPI Path: POST /users (Register)
registry.registerPath({
    method: "post",
    path: "/users",
    tags: ["Users & Authentication"],
    summary: "Register a new user",
    description:
        "Registers a new user account with email and password. Passwords are encrypted using bcrypt.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateUserSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "User registered successfully",
            content: {
                "application/json": {
                    schema: CreateUserResponseSchema,
                },
            },
        },
        400: {
            description: "Validation error or user already exists",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
    },
});

// Register OpenAPI Path: POST /users/login (Login)
registry.registerPath({
    method: "post",
    path: "/users/login",
    tags: ["Users & Authentication"],
    summary: "User login / authentication",
    description:
        "Authenticates a user by validating their email and password, returning a signed JWT access token.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateUserSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "User logged in successfully",
            content: {
                "application/json": {
                    schema: LoginUserResponseSchema,
                },
            },
        },
        400: {
            description: "Validation error (invalid email format or short password)",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        401: {
            description: "Authentication failed (incorrect email or password)",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
    },
});