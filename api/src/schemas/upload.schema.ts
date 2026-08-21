import { z } from "zod"
import { registry, ErrorResponseSchema } from "../docs/openapi"

// Helpers
const jsonResponse = (schema: any, description: string) => ({
  description,
  content: { "application/json": { schema } },
})

// Response Schema for Upload Image
export const UploadImageResponseSchema = registry.register(
  "UploadImageResponse",
  z.object({
    success: z.boolean().openapi({ example: true }),
    data: z.object({
      url: z.string().url().openapi({
        example:
          "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto:good/recipes/sample.jpg",
        description: "Optimized HTTPS URL of the uploaded image on Cloudinary",
      }),
      publicId: z.string().openapi({
        example: "recipes/sample",
        description: "Cloudinary Public ID used for asset management and cleanup",
      }),
    }),
  })
)

// Register OpenAPI Path: POST /upload
registry.registerPath({
  method: "post",
  path: "/upload",
  tags: ["Upload"],
  summary: "Upload and optimize an image",
  description:
    "Uploads an image file to Cloudinary with automatic optimization (WebP/AVIF delivery, auto quality compression, max width 1200px limit). The image is initially assigned a temporary tag and will be automatically cleaned up after 24 hours if not attached to a recipe.",
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
                description:
                  "Image file to upload (Max: 5MB, accepted formats: JPEG, PNG, WebP, GIF)",
              },
            },
            required: ["file"],
          },
        },
      },
    },
  },
  responses: {
    201: jsonResponse(UploadImageResponseSchema, "Image uploaded and optimized successfully"),
    400: jsonResponse(ErrorResponseSchema, "Invalid file type or no file provided"),
    401: jsonResponse(ErrorResponseSchema, "Unauthorized"),
    500: jsonResponse(ErrorResponseSchema, "Internal server error during upload"),
  },
})
