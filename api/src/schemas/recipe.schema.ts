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

// Request Schemas
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