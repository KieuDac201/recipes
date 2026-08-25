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

export const VerifyEmailSchema = registry.register(
  "VerifyEmail",
  z.object({
    token: z.string().min(1, "Verification token is required").openapi({
      example: "a8f5c9e2b1d4...",
      description: "32-byte hexadecimal verification token from magic link",
    }),
  })
)
export const verifyEmailSchema = VerifyEmailSchema
export type VerifyEmailSchemaType = z.infer<typeof VerifyEmailSchema>

export const ResendVerificationSchema = registry.register(
  "ResendVerification",
  z.object({
    email: z.string().email("Invalid email format").openapi({
      example: "user@example.com",
      description: "User email address to receive activation link",
    }),
  })
)
export const resendVerificationSchema = ResendVerificationSchema
export type ResendVerificationSchemaType = z.infer<typeof ResendVerificationSchema>

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
    message: z.string().openapi({ example: "User created successfully. Please check your email to activate account." }),
    user: UserProfileSchema,
  })
)

export const VerifyEmailResponseSchema = registry.register(
  "VerifyEmailResponse",
  z.object({
    message: z.string().openapi({ example: "Email verified successfully" }),
    user: z.object({
      user: UserProfileSchema,
      token: z.string().openapi({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT access token valid for 1 day",
      }),
    }),
  })
)

export const ResendVerificationResponseSchema = registry.register(
  "ResendVerificationResponse",
  z.object({
    message: z.string().openapi({ example: "Verification email resent successfully" }),
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
  description:
    "Registers a new user account and sends an activation magic link to the provided email.",
  request: { body: { content: jsonContent(CreateUserSchema) } },
  responses: {
    201: jsonResponse(CreateUserResponseSchema, "User registered successfully"),
    400: errResponse("Validation error or user already exists"),
    500: errResponse("Internal server error"),
  },
})

// 2. Verify Email Magic Link (POST /users/verify-email)
registry.registerPath({
  method: "post",
  path: "/users/verify-email",
  tags: ["Users & Authentication"],
  summary: "Verify email with magic link token",
  description:
    "Validates the activation magic link token, marks email as verified, and returns an active JWT session token.",
  request: { body: { content: jsonContent(VerifyEmailSchema) } },
  responses: {
    200: jsonResponse(VerifyEmailResponseSchema, "Email verified successfully"),
    400: errResponse("Invalid or expired verification token"),
    500: errResponse("Internal server error"),
  },
})

// 3. Resend Verification Email (POST /users/resend-verification)
registry.registerPath({
  method: "post",
  path: "/users/resend-verification",
  tags: ["Users & Authentication"],
  summary: "Resend email verification link",
  description: "Generates a new verification magic link and resends it to the unverified user's email.",
  request: { body: { content: jsonContent(ResendVerificationSchema) } },
  responses: {
    200: jsonResponse(ResendVerificationResponseSchema, "Verification email resent successfully"),
    400: errResponse("Validation error or account already verified"),
    404: errResponse("User not found"),
    500: errResponse("Internal server error"),
  },
})

// 4. User Login (POST /users/login)
registry.registerPath({
  method: "post",
  path: "/users/login",
  tags: ["Users & Authentication"],
  summary: "User login / authentication",
  description:
    "Authenticates a user by email and password. Returns 403 Forbidden if email is not verified yet.",
  request: { body: { content: jsonContent(CreateUserSchema) } },
  responses: {
    200: jsonResponse(LoginUserResponseSchema, "User logged in successfully"),
    400: errResponse("Validation error (invalid email format or short password)"),
    401: errResponse("Authentication failed (incorrect email or password)"),
    403: errResponse("Account is not activated / email not verified"),
    500: errResponse("Internal server error"),
  },
})

// 5. Forgot Password (POST /users/forgot-password)
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

// 6. Reset Password (POST /users/reset-password)
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
