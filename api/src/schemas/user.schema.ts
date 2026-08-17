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

// Schema for forgot password request payload
export const ForgotPasswordSchema = registry.register(
    "ForgotPassword",
    z.object({
        email: z.string().email("Invalid email format").openapi({
            example: "user@example.com",
            description: "User email address to send OTP",
        }),
    })
);

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export const forgotPasswordSchema = ForgotPasswordSchema;

// Response Schema for Forgot Password
export const ForgotPasswordResponseSchema = registry.register(
    "ForgotPasswordResponse",
    z.object({
        message: z.string().openapi({ example: "OTP sent successfully" }),
    })
);

// Schema for reset password request payload
export const ResetPasswordSchema = registry.register(
    "ResetPassword",
    z.object({
        email: z.string().email("Invalid email format").openapi({
            example: "user@example.com",
            description: "User email address",
        }),
        otp: z.string().length(6, "OTP must be 6 digits").openapi({
            example: "123456",
            description: "6-digit OTP received via email",
        }),
        password: z.string().min(6, "Password must be at least 6 characters long").openapi({
            example: "newSecurePassword123",
            description: "New password (minimum 6 characters)",
        }),
    })
);

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export const resetPasswordSchema = ResetPasswordSchema;

// Response Schema for Reset Password
export const ResetPasswordResponseSchema = registry.register(
    "ResetPasswordResponse",
    z.object({
        message: z.string().openapi({ example: "Password reset successfully" }),
    })
);

// Register OpenAPI Path: POST /users/forgot-password (Forgot Password)
registry.registerPath({
    method: "post",
    path: "/users/forgot-password",
    tags: ["Users & Authentication"],
    summary: "Request password reset OTP",
    description:
        "Generates a 6-digit OTP code and sends it to the user's registered email address for password recovery.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: ForgotPasswordSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP sent successfully",
            content: {
                "application/json": {
                    schema: ForgotPasswordResponseSchema,
                },
            },
        },
        400: {
            description: "Validation error (invalid email format)",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        404: {
            description: "Email not found",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        429: {
            description: "Too many reset requests. Rate limited.",
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

// Register OpenAPI Path: POST /users/reset-password (Reset Password)
registry.registerPath({
    method: "post",
    path: "/users/reset-password",
    tags: ["Users & Authentication"],
    summary: "Reset password using OTP",
    description:
        "Verifies the OTP code sent to the email and updates the user's password.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: ResetPasswordSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Password reset successfully",
            content: {
                "application/json": {
                    schema: ResetPasswordResponseSchema,
                },
            },
        },
        400: {
            description: "Validation error, invalid OTP, or expired reset code",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        404: {
            description: "Email not found",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        429: {
            description: "Maximum reset attempts exceeded. Account locked temporarily.",
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