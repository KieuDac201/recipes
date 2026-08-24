import { z } from "zod"
import { registry, PaginationMetaSchema, ErrorResponseSchema } from "../docs/openapi"

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

const errors = {
  badRequest: jsonResponse(ErrorResponseSchema, "Invalid request payload or parameters"),
  unauthorized: jsonResponse(ErrorResponseSchema, "Unauthorized - authentication required"),
  forbidden: jsonResponse(ErrorResponseSchema, "Forbidden - requires admin privileges"),
  notFound: jsonResponse(ErrorResponseSchema, "Recipe not found"),
}

// =============================================================================
// 1. Domain Model Schemas
// =============================================================================
export const RecipeSchema = registry.register(
  "Recipe",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    title: z.string().openapi({ example: "Spaghetti Carbonara" }),
    slug: z.string().openapi({ example: "spaghetti-carbonara" }),
    description: z.string().nullable().openapi({
      example: "Classic Italian pasta dish with eggs, guanciale, and pecorino romano.",
    }),
    image_url: z.string().openapi({
      example: "https://images.example.com/spaghetti-carbonara.jpg",
    }),
    prep_time_minutes: z.number().int().openapi({ example: 15 }),
    cook_time_minutes: z.number().int().openapi({ example: 20 }),
    servings: z.number().int().openapi({ example: 4 }),
    author_id: z.number().int().nullable().optional().openapi({ example: 1 }),
    view_count: z.number().int().optional().openapi({ example: 42 }),
    status: z.enum(["pending", "approved", "rejected"]).optional().openapi({ example: "approved" }),
    rejection_reason: z.string().nullable().optional().openapi({ example: null }),
    created_at: z.union([z.string(), z.date()]).openapi({ example: "2026-08-10T08:30:00.000Z" }),
  })
)

export const IngredientSchema = registry.register(
  "Ingredient",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: "Spaghetti" }),
    amount: z.union([z.string(), z.number()]).openapi({ example: "400.00" }),
    unit: z.string().openapi({ example: "g" }),
  })
)

export const InstructionSchema = registry.register(
  "Instruction",
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    step_number: z.number().int().openapi({ example: 1 }),
    instruction: z.string().openapi({
      example: "Bring a large pot of salted water to a boil and cook pasta until al dente.",
    }),
    image_url: z
      .string()
      .nullable()
      .openapi({ example: "https://images.example.com/spaghetti.jpg" }),
  })
)

export const RecipeDetailSchema = registry.register(
  "RecipeDetail",
  RecipeSchema.extend({
    categories: z.array(z.string()).openapi({ example: ["Dinner", "Italian", "Pasta"] }),
    instructions: z.array(InstructionSchema),
    ingredients: z.array(IngredientSchema),
  })
)

// =============================================================================
// 2. Response Schemas
// =============================================================================
export const GetRecipesResponseSchema = registry.register(
  "GetRecipesResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    pagination: PaginationMetaSchema.optional(),
    data: z.array(RecipeSchema),
  })
)

export const GetRecipeDetailResponseSchema = registry.register(
  "GetRecipeDetailResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: RecipeDetailSchema,
  })
)

export const CreateRecipeResponseSchema = registry.register(
  "CreateRecipeResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: RecipeSchema,
  })
)

export const UpdateRecipeResponseSchema = registry.register(
  "UpdateRecipeResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: RecipeSchema,
  })
)

export const DeleteRecipeResponseSchema = registry.register(
  "DeleteRecipeResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: RecipeSchema,
  })
)

export const UpdateRecipeStatusResponseSchema = registry.register(
  "UpdateRecipeStatusResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: z.object({
      message: z.string().openapi({ example: "Update status successfully" }),
    }),
  })
)

export const IncreaseRecipeViewCountResponseSchema = registry.register(
  "IncreaseRecipeViewCountResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: z.object({
      message: z.string().openapi({ example: "Increase view count successfully" }),
    }),
  })
)

// =============================================================================
// 3. Request Payloads & Param Schemas
// =============================================================================
export const createIngredientPayloadSchema = z.object({
  name: z
    .string()
    .min(1, "Ingredient name is required")
    .openapi({ example: "Xương ống / Xương bò" }),
  unit: z.string().min(1, "Unit is required").openapi({ example: "kg" }),
  amount: z.union([z.string(), z.number()]).openapi({ example: 2 }),
})

export const createInstructionPayloadSchema = z.object({
  step_number: z.number().int().positive("Step number must be positive").openapi({ example: 1 }),
  instruction: z.string().min(1, "Instruction text is required").openapi({
    example:
      "Chần xương bò trong nước sôi khoảng 10 phút, sau đó vớt ra rửa sạch lại bằng nước lạnh để loại bỏ bọt bẩn.",
  }),
  image_url: z.string().nullable().optional().openapi({ example: null }),
})

export const createRecipePayloadSchema = registry.register(
  "CreateRecipePayload",
  z.object({
    title: z.string().min(1, "Title is required").openapi({ example: "Phở Bò Truyền Thống" }),
    slug: z.string().min(1, "Slug is required").openapi({ example: "pho-bo-truyen-thong" }),
    description: z.string().nullable().optional().openapi({
      example:
        "Món phở bò truyền thống Việt Nam với nước dùng đậm đà thơm mùi hoa hồi, thảo quả, gừng nướng, ăn kèm bánh phở tươi và thịt bò mềm ngọt.",
    }),
    prep_time_minutes: z
      .number()
      .int()
      .nonnegative("Prep time must be non-negative")
      .openapi({ example: 30 }),
    cook_time_minutes: z
      .number()
      .int()
      .nonnegative("Cook time must be non-negative")
      .openapi({ example: 180 }),
    servings: z.number().int().positive("Servings must be positive").openapi({ example: 6 }),
    image_url: z.string().min(1, "Image URL is required").openapi({
      example: "https://toomva.com/images/posts/2024/11/10-tu-vung-ve-thuc-pham-thay-cho-food.jpg",
    }),
    categories: z
      .array(z.number().int().positive())
      .min(1, "At least one category is required")
      .openapi({ example: [1, 2] }),
    instructions: z
      .array(createInstructionPayloadSchema)
      .min(1, "At least one instruction step is required"),
    ingredients: z
      .array(createIngredientPayloadSchema)
      .min(1, "At least one ingredient is required"),
  })
)

export const updateRecipeStatusSchema = registry.register(
  "UpdateRecipeStatusPayload",
  z.object({
    status: z.enum(["pending", "approved", "rejected"]).openapi({
      description: "New moderation status for the recipe",
      example: "approved",
    }),
    rejection_reason: z.string().optional().nullable().openapi({
      description: "Reason for rejection if status is 'rejected'",
      example: "Hình ảnh không đạt chuẩn hoặc hướng dẫn chưa rõ ràng.",
    }),
  })
)

export const updateRecipePayloadSchema = createRecipePayloadSchema
export type CreateRecipePayload = z.infer<typeof createRecipePayloadSchema>
export type UpdateRecipePayload = CreateRecipePayload
export type UpdateRecipeStatusPayload = z.infer<typeof updateRecipeStatusSchema>

export const recipeIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path", required: true },
    description: "Unique ID or slug of the recipe",
    example: "1",
  }),
})

// =============================================================================
// 4. Query Schemas
// =============================================================================
const basePaginationShape = {
  limit: z.coerce.number().int().positive().max(100).default(10).openapi({
    description: "Number of recipes per page (max 100)",
    example: 10,
  }),
  current_page: z.coerce.number().int().positive().default(1).openapi({
    description: "Page number to retrieve",
    example: 1,
  }),
  search: z.string().optional().openapi({
    description: "Search keyword matched against recipe title (case and accent-insensitive)",
    example: "pasta",
  }),
  sort_by: z.enum(["created_at", "view_count"]).default("created_at").openapi({
    description: "Field to sort recipes by",
    example: "created_at",
  }),
  sort_order: z.enum(["asc", "desc"]).default("desc").openapi({
    description: "Sort direction",
    example: "desc",
  }),
}

export const getPublicRecipesQuerySchema = z.object(basePaginationShape)

export const getMyRecipesQuerySchema = z.object({
  ...basePaginationShape,
  status: z.enum(["pending", "approved", "rejected", "all"]).default("all").optional().openapi({
    description: "Filter recipes by moderation status",
    example: "all",
  }),
})

export const getAdminRecipesQuerySchema = getMyRecipesQuerySchema
export const getRecipesQuerySchema = getPublicRecipesQuerySchema

export type GetPublicRecipesQuery = z.infer<typeof getPublicRecipesQuerySchema>
export type GetMyRecipesQuery = z.infer<typeof getMyRecipesQuerySchema>
export type GetAdminRecipesQuery = z.infer<typeof getAdminRecipesQuerySchema>
export type GetRecipesQuery = z.infer<typeof getRecipesQuerySchema>

// =============================================================================
// 5. OpenAPI Path Registrations
// =============================================================================

// 1. Public Recipes List
registry.registerPath({
  method: "get",
  path: "/recipes",
  tags: ["Recipes"],
  summary: "List public recipes",
  description: "Returns a paginated list of approved recipes for public users.",
  request: { query: getPublicRecipesQuerySchema },
  responses: {
    200: jsonResponse(GetRecipesResponseSchema, "Successfully retrieved list of approved recipes"),
    400: errors.badRequest,
  },
})

// 2. User's Own Recipes
registry.registerPath({
  method: "get",
  path: "/recipes/my-recipes",
  tags: ["Recipes"],
  summary: "List current user's recipes",
  description:
    "Returns a paginated list of recipes created by the authenticated user with optional status filter.",
  security: [{ BearerAuth: [] }],
  request: { query: getMyRecipesQuerySchema },
  responses: {
    200: jsonResponse(
      GetRecipesResponseSchema,
      "Successfully retrieved authenticated user's recipes"
    ),
    401: errors.unauthorized,
  },
})

// 3. Admin Recipes List
registry.registerPath({
  method: "get",
  path: "/recipes/admin",
  tags: ["Recipes"],
  summary: "List all recipes (Admin moderation)",
  description:
    "Returns a paginated list of all recipes across any moderation status. Requires admin privileges.",
  security: [{ BearerAuth: [] }],
  request: { query: getAdminRecipesQuerySchema },
  responses: {
    200: jsonResponse(
      GetRecipesResponseSchema,
      "Successfully retrieved recipes for administration"
    ),
    401: errors.unauthorized,
    403: errors.forbidden,
  },
})

// 4. Recipe Detail
registry.registerPath({
  method: "get",
  path: "/recipes/{id}",
  tags: ["Recipes"],
  summary: "Get recipe details by ID or slug",
  description:
    "Returns full recipe details including categories, ingredients, and ordered instructions.",
  request: { params: recipeIdParamSchema },
  responses: {
    200: jsonResponse(GetRecipeDetailResponseSchema, "Successfully retrieved recipe details"),
    404: errors.notFound,
  },
})

// 5. Create Recipe
registry.registerPath({
  method: "post",
  path: "/recipes",
  tags: ["Recipes"],
  summary: "Create a new recipe",
  description:
    "Creates a new recipe with categories, ingredients, and instructions. Requires authentication.",
  security: [{ BearerAuth: [] }],
  request: { body: { content: jsonContent(createRecipePayloadSchema) } },
  responses: {
    201: jsonResponse(CreateRecipeResponseSchema, "Recipe created successfully"),
    400: errors.badRequest,
    401: errors.unauthorized,
  },
})

// 6. Update Recipe
registry.registerPath({
  method: "put",
  path: "/recipes/{id}",
  tags: ["Recipes"],
  summary: "Update an existing recipe by ID",
  description:
    "Updates an existing recipe including title, description, categories, ingredients, and instructions.",
  security: [{ BearerAuth: [] }],
  request: {
    params: recipeIdParamSchema,
    body: { content: jsonContent(createRecipePayloadSchema) },
  },
  responses: {
    200: jsonResponse(UpdateRecipeResponseSchema, "Recipe updated successfully"),
    400: errors.badRequest,
    401: errors.unauthorized,
    404: errors.notFound,
  },
})

// 7. Delete Recipe
registry.registerPath({
  method: "delete",
  path: "/recipes/{id}",
  tags: ["Recipes"],
  summary: "Delete a recipe by ID",
  description:
    "Deletes a recipe and its associated ingredients, instructions, and categories by ID.",
  security: [{ BearerAuth: [] }],
  request: { params: recipeIdParamSchema },
  responses: {
    200: jsonResponse(DeleteRecipeResponseSchema, "Recipe deleted successfully"),
    401: errors.unauthorized,
    404: errors.notFound,
  },
})

// 8. Update Recipe Moderation Status
registry.registerPath({
  method: "patch",
  path: "/recipes/{id}/status",
  tags: ["Recipes"],
  summary: "Update recipe moderation status",
  description:
    "Updates the status (pending, approved, rejected) and rejection reason of a recipe. Requires admin privileges.",
  security: [{ BearerAuth: [] }],
  request: {
    params: recipeIdParamSchema,
    body: { content: jsonContent(updateRecipeStatusSchema) },
  },
  responses: {
    200: jsonResponse(UpdateRecipeStatusResponseSchema, "Recipe status updated successfully"),
    400: errors.badRequest,
    401: errors.unauthorized,
    403: errors.forbidden,
    404: errors.notFound,
  },
})

// 9. Increase Recipe View Count
registry.registerPath({
  method: "patch",
  path: "/recipes/{id}/view-count",
  tags: ["Recipes"],
  summary: "Increase recipe view count",
  description: "Increments the view count of a recipe by 1. Public endpoint.",
  request: {
    params: recipeIdParamSchema,
  },
  responses: {
    200: jsonResponse(
      IncreaseRecipeViewCountResponseSchema,
      "Recipe view count increased successfully"
    ),
    400: errors.badRequest,
    404: errors.notFound,
  },
})
