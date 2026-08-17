import { z } from "zod";

/**
 * Step 1: Basic Recipe Information Schema
 */
export const recipeStep1Schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên công thức."),
  slug: z
    .string()
    .trim()
    .min(1, "Đường dẫn tĩnh (slug) không được để trống.")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ cái thường, số và dấu gạch nối (-)."),
  categories: z
    .array(z.number())
    .min(1, "Vui lòng chọn ít nhất 1 danh mục cho món ăn."),
  prepTimeMinutes: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, "Vui lòng nhập thời gian chuẩn bị.")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, "Thời gian chuẩn bị phải là số không âm."),
  cookTimeMinutes: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, "Vui lòng nhập thời gian nấu.")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, "Thời gian nấu phải là số không âm."),
  servings: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined, "Vui lòng nhập khẩu phần.")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, "Khẩu phần phải lớn hơn 0."),
  imageUrl: z
    .string()
    .trim()
    .min(1, "Vui lòng tải lên ảnh đại diện cho món ăn."),
  description: z.string().optional().nullable(),
});

export type RecipeStep1Input = z.infer<typeof recipeStep1Schema>;

/**
 * Single Ingredient Schema
 */
export const ingredientItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Vui lòng nhập tên nguyên liệu."),
  amount: z.union([z.string(), z.number()]).refine((val) => String(val).trim().length > 0, "Vui lòng nhập định lượng."),
  unit: z.string().trim().min(1, "Vui lòng chọn hoặc nhập đơn vị."),
});

/**
 * Single Instruction Step Schema
 */
export const instructionStepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().int().positive(),
  title: z.string().optional(),
  instruction: z.string().trim().min(1, "Vui lòng nhập hướng dẫn chi tiết cho bước này."),
  imageUrl: z.string().nullable().optional(),
});

/**
 * Step 2: Ingredients & Instructions Schema
 */
export const recipeStep2Schema = z.object({
  ingredients: z
    .array(ingredientItemSchema)
    .refine(
      (items) => items.some((item) => item.name.trim() !== ""),
      "Vui lòng thêm ít nhất 1 nguyên liệu có tên rõ ràng."
    ),
  instructions: z
    .array(instructionStepSchema)
    .refine(
      (steps) => steps.some((step) => step.instruction.trim() !== ""),
      "Vui lòng thêm ít nhất 1 bước thực hiện có nội dung."
    ),
});

export type RecipeStep2Input = z.infer<typeof recipeStep2Schema>;

/**
 * Full Recipe Form Schema
 */
export const fullRecipeFormSchema = recipeStep1Schema.and(recipeStep2Schema);
export type FullRecipeFormInput = z.infer<typeof fullRecipeFormSchema>;
