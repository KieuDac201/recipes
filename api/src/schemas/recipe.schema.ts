import { z } from "zod";
import {
    registry,
    PaginationMetaSchema,
    ErrorResponseSchema,
} from "../docs/openapi";

// Domain Model Schemas
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
        created_at: z.union([z.string(), z.date()]).openapi({
            example: "2026-08-10T08:30:00.000Z",
        }),
    })
);

export const IngredientSchema = registry.register(
    "Ingredient",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Spaghetti" }),
        amount: z.union([z.string(), z.number()]).openapi({ example: "400.00" }),
        unit: z.string().openapi({ example: "g" }),
    })
);

export const InstructionSchema = registry.register(
    "Instruction",
    z.object({
        id: z.number().int().openapi({ example: 1 }),
        step_number: z.number().int().openapi({ example: 1 }),
        instruction: z.string().openapi({
            example: "Bring a large pot of salted water to a boil and cook pasta until al dente.",
        }),
        image_url: z.string().nullable().openapi({ example: "https://images.example.com/spaghetti.jpg" }),
    })
);

export const RecipeDetailSchema = registry.register(
    "RecipeDetail",
    RecipeSchema.extend({
        categories: z.array(z.string()).openapi({
            example: ["Dinner", "Italian", "Pasta"],
        }),
        instructions: z.array(InstructionSchema),
        ingredients: z.array(IngredientSchema),
    })
);

// Response Schemas
export const GetRecipesResponseSchema = registry.register(
    "GetRecipesResponse",
    z.object({
        success: z.boolean().openapi({ example: true }),
        pagination: PaginationMetaSchema.optional(),
        data: z.array(RecipeSchema),
    })
);

export const GetRecipeDetailResponseSchema = registry.register(
    "GetRecipeDetailResponse",
    z.object({
        success: z.boolean().openapi({ example: true }),
        data: RecipeDetailSchema,
    })
);

export const CreateRecipeResponseSchema = registry.register(
    "CreateRecipeResponse",
    z.object({
        success: z.boolean().openapi({ example: true }),
        data: RecipeSchema,
    })
);

// Request Schemas
export const createIngredientPayloadSchema = z.object({
    name: z.string().min(1, "Ingredient name is required").openapi({ example: "Xương ống / Xương bò" }),
    unit: z.string().min(1, "Unit is required").openapi({ example: "kg" }),
    amount: z.union([z.string(), z.number()]).openapi({ example: 2 }),
});

export const createInstructionPayloadSchema = z.object({
    step_number: z.number().int().positive("Step number must be positive").openapi({ example: 1 }),
    instruction: z.string().min(1, "Instruction text is required").openapi({
        example: "Chần xương bò trong nước sôi khoảng 10 phút, sau đó vớt ra rửa sạch lại bằng nước lạnh để loại bỏ bọt bẩn.",
    }),
    image_url: z.string().nullable().optional().openapi({ example: null }),
});

export const createRecipePayloadSchema = registry.register(
    "CreateRecipePayload",
    z.object({
        title: z.string().min(1, "Title is required").openapi({ example: "Phở Bò Truyền Thống" }),
        slug: z.string().min(1, "Slug is required").openapi({ example: "pho-bo-truyen-thong" }),
        description: z.string().nullable().optional().openapi({
            example: "Món phở bò truyền thống Việt Nam với nước dùng đậm đà thơm mùi hoa hồi, thảo quả, gừng nướng, ăn kèm bánh phở tươi và thịt bò mềm ngọt.",
        }),
        prep_time_minutes: z.number().int().nonnegative("Prep time must be non-negative").openapi({ example: 30 }),
        cook_time_minutes: z.number().int().nonnegative("Cook time must be non-negative").openapi({ example: 180 }),
        servings: z.number().int().positive("Servings must be positive").openapi({ example: 6 }),
        image_url: z.string().min(1, "Image URL is required").openapi({
            example: "https://toomva.com/images/posts/2024/11/10-tu-vung-ve-thuc-pham-thay-cho-food.jpg",
        }),
        categories: z.array(z.number().int().positive()).min(1, "At least one category is required").openapi({
            example: [1, 2],
        }),
        instructions: z.array(createInstructionPayloadSchema).min(1, "At least one instruction step is required"),
        ingredients: z.array(createIngredientPayloadSchema).min(1, "At least one ingredient is required"),
    })
);

export type CreateRecipePayload = z.infer<typeof createRecipePayloadSchema>;

export const getRecipesQuerySchema = z.object({
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .default(10)
        .openapi({
            description: "Number of recipes per page (max 100)",
            example: 10,
        }),
    current_page: z.coerce
        .number()
        .int()
        .positive()
        .default(1)
        .openapi({
            description: "Page number to retrieve",
            example: 1,
        }),
    search: z.string().optional().openapi({
        description:
            "Search keyword matched against recipe title (case and accent-insensitive)",
        example: "pasta",
    }),
});

export const recipeIdParamSchema = z.object({
    id: z.string().openapi({
        param: {
            name: "id",
            in: "path",
            required: true,
        },
        description: "Unique ID of the recipe",
        example: "1",
    }),
});

export type GetRecipesQuery = z.infer<typeof getRecipesQuerySchema>;

// Register OpenAPI Paths
registry.registerPath({
    method: "get",
    path: "/recipes",
    tags: ["Recipes"],
    summary: "List recipes with pagination and search",
    description:
        "Returns a paginated list of recipes. Allows filtering by title using case and accent-insensitive matching.",
    request: {
        query: getRecipesQuerySchema,
    },
    responses: {
        200: {
            description: "Successfully retrieved list of recipes",
            content: {
                "application/json": {
                    schema: GetRecipesResponseSchema,
                },
            },
        },
        400: {
            description: "Invalid query parameters",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/recipes/{id}",
    tags: ["Recipes"],
    summary: "Get recipe details by ID",
    description:
        "Returns full recipe details including categories, ingredients, and ordered instructions.",
    request: {
        params: recipeIdParamSchema,
    },
    responses: {
        200: {
            description: "Successfully retrieved recipe details",
            content: {
                "application/json": {
                    schema: GetRecipeDetailResponseSchema,
                },
            },
        },
        404: {
            description: "Recipe not found",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/recipes",
    tags: ["Recipes"],
    summary: "Create a new recipe",
    description: "Creates a new recipe with categories, ingredients, and instructions.",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createRecipePayloadSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Recipe created successfully",
            content: {
                "application/json": {
                    schema: CreateRecipeResponseSchema,
                },
            },
        },
        400: {
            description: "Invalid request payload",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
    },
});