import { z } from "zod";

const getRecipesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).default(10),
    current_page: z.coerce.number().int().positive().default(1),
    search: z.string().optional(),
});

type GetRecipesQuery = z.infer<typeof getRecipesQuerySchema>;
export {
    getRecipesQuerySchema,
    type GetRecipesQuery
};