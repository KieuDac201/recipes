import { query } from "../config/db.js"
import { Recipe } from "../types/recipe.type.js"

const findAllRecipes = async (limit: number, offset: number, search?: string): Promise<{ recipes: Recipe[], totalPage: number }> => {
    const searchValue = search || ""
    const dataSQL = `
        SELECT * FROM recipes 
        WHERE unaccent(LOWER(title)) LIKE unaccent(LOWER($3))
        ORDER BY id
        LIMIT $1 OFFSET $2
    `;
    const totalCountSQL = `SELECT COUNT(*) as total FROM recipes`;

    const [result, totalCount] = await Promise.all([
        query(dataSQL, [limit, offset, `%${searchValue}%`]),
        query(totalCountSQL),
    ]);
    const totalPage = Math.ceil(totalCount.rows[0].total / limit);

    return { recipes: result.rows, totalPage };
}

const findRecipeById = async (id: string): Promise<Recipe | null> => {
    const dataSQL = `
        SELECT 
            r.*,
            COALESCE(
                json_agg(DISTINCT c.name),
                '[]'::json
            ) AS categories,
            COALESCE(
                (
                    SELECT json_agg(
                        jsonb_build_object(
                            'id', i.id,
                            'step_number', i.step_number,
                            'instruction', i.instruction
                        ) ORDER BY i.step_number ASC
                    ) 
                    FROM instructions i 
                    WHERE i.recipe_id = r.id
                ),
                '[]'::json 
            ) AS instructions,
            COALESCE(
                (
                    SELECT json_agg(
                        jsonb_build_object(
                            'id', igd.id,
                            'name', igd.name,
                            'amount', igd.amount,
                            'unit', igd.unit
                        ) 
                    ) 
                    FROM ingredients igd
                    WHERE igd.recipe_id = r.id
                ),
                '[]'::json
            ) AS ingredients
        FROM recipes r
        LEFT JOIN recipes_categories rc ON rc.recipe_id = r.id
        LEFT JOIN categories c ON c.id = rc.category_id
        WHERE r.id = $1
        GROUP BY r.id
    `;
    const result = await query(dataSQL, [id]);
    return result.rows[0] || null;
}

export {
    findAllRecipes,
    findRecipeById
}