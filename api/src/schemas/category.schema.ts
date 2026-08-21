import { z } from "zod"
import { registry, ErrorResponseSchema } from "../docs/openapi"

// Helper Utilities for OpenAPI Definitions
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
  notFound: jsonResponse(ErrorResponseSchema, "Category not found"),
  serverError: jsonResponse(ErrorResponseSchema, "Internal server error"),
}

// =============================================================================
// 1. Domain Model Schema
// =============================================================================
export const CategorySchema = registry.register(
  "Category",
  z.object({
    id: z.number().int().openapi({ example: 1, description: "Unique category ID" }),
    name: z.string().openapi({ example: "Món Canh / Súp", description: "Category display name" }),
    slug: z
      .string()
      .openapi({ example: "mon-canh-sup", description: "URL-friendly slug of the category" }),
  })
)

export type CategorySchemaType = z.infer<typeof CategorySchema>

// =============================================================================
// 2. Request & Parameter Schemas
// =============================================================================
export const categoryIdParamSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path", required: true },
    description: "Unique ID of the category",
    example: "1",
  }),
})

export const CreateCategoryPayloadSchema = registry.register(
  "CreateCategoryPayload",
  z.object({
    name: z.string().min(1, "Category name is required").openapi({
      example: "Món Chay",
      description: "Category display name",
    }),
    slug: z.string().min(1, "Slug is required").optional().openapi({
      example: "mon-chay",
      description: "URL-friendly slug of the category (auto-generated from name if omitted)",
    }),
  })
)

export const createCategoryPayloadSchema = CreateCategoryPayloadSchema
export type CreateCategoryPayloadType = z.infer<typeof CreateCategoryPayloadSchema>

export const UpdateCategoryPayloadSchema = registry.register(
  "UpdateCategoryPayload",
  z
    .object({
      name: z.string().min(1, "Category name is required").optional().openapi({
        example: "Món Canh / Súp",
        description: "Category display name",
      }),
      slug: z.string().min(1, "Slug is required").optional().openapi({
        example: "mon-canh-sup",
        description: "URL-friendly slug of the category",
      }),
    })
    .refine((data) => data.name !== undefined || data.slug !== undefined, {
      message: "At least one field (name or slug) must be provided",
    })
)

export const updateCategoryPayloadSchema = UpdateCategoryPayloadSchema
export type UpdateCategoryPayloadType = z.infer<typeof UpdateCategoryPayloadSchema>

// =============================================================================
// 3. Response Schemas
// =============================================================================
export const GetAllCategoriesResponseSchema = registry.register(
  "GetAllCategoriesResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: z.array(CategorySchema).openapi({
      description: "List of all recipe categories",
    }),
  })
)

export const CreateCategoryResponseSchema = registry.register(
  "CreateCategoryResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: CategorySchema,
  })
)

export const UpdateCategoryResponseSchema = registry.register(
  "UpdateCategoryResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: CategorySchema,
  })
)

export const DeleteCategoryResponseSchema = registry.register(
  "DeleteCategoryResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: CategorySchema,
  })
)

// =============================================================================
// 4. Register OpenAPI Paths
// =============================================================================

// GET /categories
registry.registerPath({
  method: "get",
  path: "/categories",
  tags: ["Categories"],
  summary: "Get all categories",
  description: "Retrieves the complete list of recipe categories.",
  responses: {
    200: jsonResponse(GetAllCategoriesResponseSchema, "Successfully retrieved categories"),
    500: errors.serverError,
  },
})

// POST /categories
registry.registerPath({
  method: "post",
  path: "/categories",
  tags: ["Categories"],
  summary: "Create a new category",
  description: "Creates a new recipe category. Requires admin privileges.",
  security: [{ BearerAuth: [] }],
  request: {
    body: { content: jsonContent(CreateCategoryPayloadSchema) },
  },
  responses: {
    201: jsonResponse(CreateCategoryResponseSchema, "Category created successfully"),
    400: errors.badRequest,
    401: errors.unauthorized,
    403: errors.forbidden,
    500: errors.serverError,
  },
})

// PUT /categories/{id}
registry.registerPath({
  method: "put",
  path: "/categories/{id}",
  tags: ["Categories"],
  summary: "Update category by ID",
  description: "Updates an existing category name or slug. Requires admin privileges.",
  security: [{ BearerAuth: [] }],
  request: {
    params: categoryIdParamSchema,
    body: { content: jsonContent(UpdateCategoryPayloadSchema) },
  },
  responses: {
    200: jsonResponse(UpdateCategoryResponseSchema, "Category updated successfully"),
    400: errors.badRequest,
    401: errors.unauthorized,
    403: errors.forbidden,
    404: errors.notFound,
    500: errors.serverError,
  },
})

// DELETE /categories/{id}
registry.registerPath({
  method: "delete",
  path: "/categories/{id}",
  tags: ["Categories"],
  summary: "Delete category by ID",
  description: "Deletes an existing category by ID. Requires admin privileges.",
  security: [{ BearerAuth: [] }],
  request: {
    params: categoryIdParamSchema,
  },
  responses: {
    200: jsonResponse(DeleteCategoryResponseSchema, "Category deleted successfully"),
    401: errors.unauthorized,
    403: errors.forbidden,
    404: errors.notFound,
    500: errors.serverError,
  },
})


