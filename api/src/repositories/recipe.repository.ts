import { pool, query } from "../config/db"
import { Recipe, RecipeBody, RecipeDetail } from "../types/recipe.type"

const findAllRecipes = async (limit: number, offset: number, search?: string): Promise<{ recipes: Recipe[], totalPage: number }> => {
    const searchValue = search || ""
    /*sql*/
    const dataSQL = `
        SELECT * FROM recipes 
        WHERE unaccent(LOWER(title)) LIKE unaccent(LOWER($3))
        ORDER BY id
        LIMIT $1 OFFSET $2
    `;
    /*sql*/
    const totalCountSQL = `
        SELECT COUNT(*) as total FROM recipes
        WHERE unaccent(LOWER(title)) LIKE unaccent(LOWER($1))
    `;

    const [result, totalCount] = await Promise.all([
        query(dataSQL, [limit, offset, `%${searchValue}%`]),
        query(totalCountSQL, [`%${searchValue}%`]),
    ]);
    const totalPage = Math.ceil(totalCount.rows[0].total / limit);

    return { recipes: result.rows, totalPage };
}

const findRecipeById = async (id: string): Promise<RecipeDetail | null> => {
    const isNumeric = /^\d+$/.test(id);
    /*sql*/
    const dataSQL = `
        SELECT 
            r.*,
            COALESCE(
                (
                    SELECT json_agg(c.name)
                    FROM recipes_categories rc
                    JOIN categories c ON c.id = rc.category_id
                    WHERE rc.recipe_id = r.id
                ),
                '[]'::json
            ) AS categories,
            COALESCE(
                (
                    SELECT json_agg(
                        jsonb_build_object(
                            'id', i.id,
                            'step_number', i.step_number,
                            'instruction', i.instruction,
                            'image_url', i.image_url
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
        WHERE ${isNumeric ? "r.id = $1" : "r.slug = $1"}
    `;
    const result = await query(dataSQL, [id]);
    return result.rows[0] || null;
}

const insertIngredientsSql = `INSERT INTO ingredients (recipe_id, name, amount, unit)
                 SELECT $1, x.name, x.amount, x.unit
                 FROM jsonb_to_recordset($2::jsonb) AS x(name text, amount numeric, unit text)`

const insertInstructionsSql = `INSERT INTO instructions (recipe_id, step_number, instruction, image_url)
                 SELECT $1, x.step_number, x.instruction, x.image_url
                 FROM jsonb_to_recordset($2::jsonb) AS x(step_number int, instruction text, image_url text)`

const linkRecipeWithCateSql = `INSERT INTO recipes_categories (recipe_id, category_id)
                 SELECT $1, id FROM categories WHERE id = ANY($2::int[])`

const createRecipe = async (recipe: RecipeBody): Promise<Recipe> => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        /*sql*/
        const recipeSql = `
        INSERT INTO recipes (title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
        const { title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings } = recipe;
        const result = await client.query(recipeSql, [title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings]);
        const recipeId = result.rows[0].id;

        if (recipe.ingredients && recipe.ingredients.length > 0) {
            await client.query(
                insertIngredientsSql,
                [recipeId, JSON.stringify(recipe.ingredients)]
            );
        }

        if (recipe.categories?.length > 0) {
            await client.query(
                linkRecipeWithCateSql,
                [recipeId, recipe.categories]
            );
        }

        if (recipe.instructions?.length > 0) {
            await client.query(
                insertInstructionsSql,
                [recipeId, JSON.stringify(recipe.instructions)]
            );
        }


        const recipeCreated = {
            id: recipeId,
            ...recipe,
            created_at: new Date(),
        };

        await client.query('COMMIT');
        return recipeCreated;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }

}

const updateRecipe = async (id: string, recipe: RecipeBody): Promise<Omit<Recipe, "created_at">> => {
    const client = await pool.connect()

    try {
        await client.query('BEGIN');
        /*sql*/
        const recipeSql = `
            UPDATE recipes
            SET title = COALESCE($1, title),
                slug = COALESCE($2, slug),
                description = COALESCE($3, description),
                image_url = COALESCE($4, image_url),
                prep_time_minutes = COALESCE($5, prep_time_minutes),
                cook_time_minutes = COALESCE($6, cook_time_minutes),
                servings = COALESCE($7, servings)
            WHERE id = $8
            RETURNING *
        `
        const { title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings } = recipe
        await client.query(recipeSql, [title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings, id])

        if (recipe.ingredients?.length > 0) {
            await client.query(`DELETE FROM ingredients WHERE recipe_id = $1`, [id])

            await client.query(
                insertIngredientsSql,
                [id, JSON.stringify(recipe.ingredients)]
            );

        }

        if (recipe.instructions?.length > 0) {
            await client.query(`DELETE FROM instructions WHERE recipe_id = $1`, [id])

            await client.query(
                insertInstructionsSql,
                [id, JSON.stringify(recipe.instructions)]
            );
        }

        if (recipe.categories?.length > 0) {
            await client.query(`DELETE FROM recipes_categories WHERE recipe_id = $1`, [id])

            await client.query(
                linkRecipeWithCateSql,
                [id, recipe.categories]
            );
        }

        const recipeCreated = {
            id: Number(id),
            ...recipe,
        }

        await client.query("COMMIT")
        return recipeCreated
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

const deleteRecipe = async (id: string): Promise<Recipe> => {
    /*sql*/
    const deleteSql = `
        DELETE FROM recipes WHERE id = $1 RETURNING *
    `
    const result = await query(deleteSql, [id])

    return result.rows[0];
}

// Kiểm tra xem publicId/URL ảnh có đang được lưu trong recipes hoặc instructions không
const isImageUsedInRecipe
    = async (publicId: string): Promise<boolean> => {
        const sql = `
        SELECT 1 FROM recipes WHERE image_url LIKE $1
        UNION
        SELECT 1 FROM instructions WHERE image_url LIKE $1
        LIMIT 1;
    `;
        const res = await query(sql, [`%${publicId}%`]);
        return (res.rowCount ?? 0) > 0;
    };

export {
    findAllRecipes,
    findRecipeById,
    createRecipe,
    isImageUsedInRecipe,
    deleteRecipe,
    updateRecipe
}