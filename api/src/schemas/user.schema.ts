import { z } from "zod"
import { registry, ErrorResponseSchema } from "../docs/openapi"

// =============================================================================
// Helper Utilities for Concise OpenAPI Definitions
// =============================================================================
const jsonContent = (schema: any) => ({
  "application/json": { schema },
})

const jsonResponse = (schema: any, description: string) => ({
  description,
  content: jsonContent(schema),
})

const errResponse = (desc: string) => jsonResponse(ErrorResponseSchema, desc)

// =============================================================================
// 1. Models & Payload Schemas
// =============================================================================
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
)
export const createUserSchema = CreateUserSchema
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>

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
)

export const ForgotPasswordSchema = registry.register(
  "ForgotPassword",
  z.object({
    email: z.string().email("Invalid email format").openapi({
      example: "user@example.com",
      description: "User email address to send OTP",
    }),
  })
)
export const forgotPasswordSchema = ForgotPasswordSchema
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>

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
)
export const resetPasswordSchema = ResetPasswordSchema
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>

// =============================================================================
// 2. Response Schemas
// =============================================================================
export const CreateUserResponseSchema = registry.register(
  "CreateUserResponse",
  z.object({
    message: z.string().openapi({ example: "User created successfully" }),
    user: UserProfileSchema,
  })
)

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
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT access token valid for 1 day",
      }),
    }),
  })
)

export const ForgotPasswordResponseSchema = registry.register(
  "ForgotPasswordResponse",
  z.object({
    message: z.string().openapi({ example: "OTP sent successfully" }),
  })
)

export const ResetPasswordResponseSchema = registry.register(
  "ResetPasswordResponse",
  z.object({
    message: z.string().openapi({ example: "Password reset successfully" }),
  })
)

// =============================================================================
// 3. OpenAPI Path Registrations
// =============================================================================

// 1. User Registration (POST /users)
registry.registerPath({
  method: "post",
  path: "/users",
  tags: ["Users & Authentication"],
  summary: "Register a new user",
  description: "Registers a new user account with email and password.",
  request: { body: { content: jsonContent(CreateUserSchema) } },
  responses: {
    201: jsonResponse(CreateUserResponseSchema, "User registered successfully"),
    400: errResponse("Validation error or user already exists"),
    500: errResponse("Internal server error"),
  },
})

// 2. User Login (POST /users/login)
registry.registerPath({
  method: "post",
  path: "/users/login",
  tags: ["Users & Authentication"],
  summary: "User login / authentication",
  description: "Authenticates a user by email and password, returning a signed JWT access token.",
  request: { body: { content: jsonContent(CreateUserSchema) } },
  responses: {
    200: jsonResponse(LoginUserResponseSchema, "User logged in successfully"),
    400: errResponse("Validation error (invalid email format or short password)"),
    401: errResponse("Authentication failed (incorrect email or password)"),
    500: errResponse("Internal server error"),
  },
})

// 3. Forgot Password (POST /users/forgot-password)
registry.registerPath({
  method: "post",
  path: "/users/forgot-password",
  tags: ["Users & Authentication"],
  summary: "Request password reset OTP",
  description:
    "Generates a 6-digit OTP code and sends it to the user's email for password recovery.",
  request: { body: { content: jsonContent(ForgotPasswordSchema) } },
  responses: {
    200: jsonResponse(ForgotPasswordResponseSchema, "OTP sent successfully"),
    400: errResponse("Validation error (invalid email format)"),
    404: errResponse("Email not found"),
    429: errResponse("Too many reset requests. Rate limited."),
    500: errResponse("Internal server error"),
  },
})

// 4. Reset Password (POST /users/reset-password)
registry.registerPath({
  method: "post",
  path: "/users/reset-password",
  tags: ["Users & Authentication"],
  summary: "Reset password using OTP",
  description: "Verifies OTP code and updates the user's password.",
  request: { body: { content: jsonContent(ResetPasswordSchema) } },
  responses: {
    200: jsonResponse(ResetPasswordResponseSchema, "Password reset successfully"),
    400: errResponse("Validation error, invalid OTP, or expired reset code"),
    404: errResponse("Email not found"),
    429: errResponse("Maximum reset attempts exceeded. Account locked temporarily."),
    500: errResponse("Internal server error"),
  },
})
