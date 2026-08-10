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
        SELECT * FROM recipes WHERE id = $1
    `;
    const result = await query(dataSQL, [id]);
    return result.rows[0] || null;
}

export {
    findAllRecipes,
    findRecipeById
}