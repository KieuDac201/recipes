import { query } from "../config/db.js"
import { Recipe } from "../types/recipe.type.js"

export const findAllRecipes = async (limit: number, offset: number): Promise<{ recipes: Recipe[], totalPage: number }> => {
    const dataSQL = `
        SELECT * FROM recipes ORDER BY id
        LIMIT $1 OFFSET $2
    `;
    const totalCountSQL = `SELECT COUNT(*) as total FROM recipes`;

    const [result, totalCount] = await Promise.all([
        query(dataSQL, [limit, offset]),
        query(totalCountSQL),
    ]);
    const totalPage = Math.ceil(totalCount.rows[0].total / limit);

    return { recipes: result.rows, totalPage };
}