import { query } from "../config/db.js"
import { Recipe } from "../types/recipe.type.js"

export const findAllRecipes = async (): Promise<Recipe[]> => {
    const SQL = `
        SELECT * FROM recipes ORDER BY id
    `;
    const result = await query(SQL);

    return result.rows;
}