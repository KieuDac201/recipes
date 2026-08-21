import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

// Extend Zod with OpenAPI methods (.openapi(...))
extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

// Reusable Common Schemas
export const bearerAuth = registry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Enter your JWT token in the format: Bearer <token>",
})

export const PaginationMetaSchema = registry.register(
  "PaginationMeta",
  z.object({
    currentPage: z.number().int().optional().openapi({ example: 1 }),
    totalPage: z.number().int().optional().openapi({ example: 5 }),
    limit: z.number().int().optional().openapi({ example: 10 }),
  })
)

export const ErrorResponseSchema = registry.register(
  "ErrorResponse",
  z.object({
    success: z.boolean().openapi({ example: false }),
    error: z.string().openapi({ example: "Not Found" }),
    details: z.any().optional(),
  })
)

export const getOpenApiDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Recipes API Documentation",
      description:
        "Automatic OpenAPI documentation generated from Zod schemas for the Recipes API.",
    },
    servers: [
      {
        url: "/api",
        description: "API Base URL",
      },
    ],
  })
}
