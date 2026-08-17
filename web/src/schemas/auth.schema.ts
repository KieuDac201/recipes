import { z } from "zod";

/**
 * Login Form Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ email.")
    .email("Định dạng email không hợp lệ."),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Register Form Validation Schema
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập địa chỉ email.")
      .email("Định dạng email không hợp lệ."),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng nhập lại mật khẩu xác nhận."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Helper to convert Zod error issues into a key-value record of field errors
 */
export function formatZodFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
