import { pool, query } from "../config/db"
import { SortOrder } from "../types"
import { Recipe, RecipeBody, RecipeDetail, RecipeSortBy, RecipeStatus } from "../types/recipe.type"

const findAllRecipes = async ({
  limit,
  offset,
  search,
  status,
  authorId,
  sortBy,
  sortOrder,
}: {
  limit: number
  offset: number
  search?: string
  status?: RecipeStatus
  authorId?: number
  sortBy: RecipeSortBy
  sortOrder: SortOrder
}): Promise<{ recipes: Recipe[]; totalPage: number; totalCount: number }> => {
  const conditions = []
  const params = []
  if (search) {
    conditions.push(`unaccent(LOWER(title)) LIKE unaccent(LOWER($${conditions.length + 1}))`)
    params.push(`%${search}%`)
  }
  if (status && status !== "all") {
    conditions.push(`status = $${conditions.length + 1}`)
    params.push(status)
  }

  if (authorId) {
    conditions.push(`author_id = $${conditions.length + 1}`)
    params.push(authorId)
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  /*sql*/
  const dataSQL = `
        SELECT * FROM recipes 
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}, id ${sortOrder}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `
  /*sql*/
  const totalCountSQL = `
        SELECT COUNT(*) as total FROM recipes
        ${whereClause}
    `

  const [result, totalCount] = await Promise.all([
    query(dataSQL, [...params, limit, offset]),
    query(totalCountSQL, [...params]),
  ])
  const total = totalCount.rows[0].total
  const totalPage = Math.ceil(total / limit)

  return { recipes: result.rows, totalPage, totalCount: total }
}

const findRecipeById = async (id: string): Promise<RecipeDetail | null> => {
  const isNumeric = /^\d+$/.test(id)
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
    `
  const result = await query(dataSQL, [id])
  return result.rows[0] || null
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
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    /*sql*/
    const recipeSql = `
        INSERT INTO recipes (title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings, author_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `
    const {
      title,
      slug,
      description,
      image_url,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      author_id,
    } = recipe
    const result = await client.query(recipeSql, [
      title,
      slug,
      description,
      image_url,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      author_id,
    ])
    const recipeId = result.rows[0].id

    if (recipe.ingredients && recipe.ingredients.length > 0) {
      await client.query(insertIngredientsSql, [recipeId, JSON.stringify(recipe.ingredients)])
    }

    if (recipe.categories?.length > 0) {
      await client.query(linkRecipeWithCateSql, [recipeId, recipe.categories])
    }

    if (recipe.instructions?.length > 0) {
      await client.query(insertInstructionsSql, [recipeId, JSON.stringify(recipe.instructions)])
    }

    const recipeCreated = {
      id: recipeId,
      ...recipe,
      created_at: new Date(),
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

const updateRecipe = async (
  id: string,
  recipe: RecipeBody
): Promise<Omit<Recipe, "created_at">> => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
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
    const { title, slug, description, image_url, prep_time_minutes, cook_time_minutes, servings } =
      recipe
    await client.query(recipeSql, [
      title,
      slug,
      description,
      image_url,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      id,
    ])

    if (recipe.ingredients?.length > 0) {
      await client.query(`DELETE FROM ingredients WHERE recipe_id = $1`, [id])

      await client.query(insertIngredientsSql, [id, JSON.stringify(recipe.ingredients)])
    }

    if (recipe.instructions?.length > 0) {
      await client.query(`DELETE FROM instructions WHERE recipe_id = $1`, [id])

      await client.query(insertInstructionsSql, [id, JSON.stringify(recipe.instructions)])
    }

    if (recipe.categories?.length > 0) {
      await client.query(`DELETE FROM recipes_categories WHERE recipe_id = $1`, [id])

      await client.query(linkRecipeWithCateSql, [id, recipe.categories])
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

  return result.rows[0]
}

// Lấy toàn bộ image_url đang có trong database (recipes và instructions)
const getAllUsedImageUrls = async (): Promise<string[]> => {
  const sql = `
        SELECT image_url FROM recipes WHERE image_url IS NOT NULL AND image_url != ''
        UNION
        SELECT image_url FROM instructions WHERE image_url IS NOT NULL AND image_url != '';
    `
  const res = await query(sql)
  return res.rows.map((row: { image_url: string }) => row.image_url)
}

// Kiểm tra xem publicId/URL ảnh có đang được lưu trong recipes hoặc instructions không
const isImageUsedInRecipe = async (publicId: string): Promise<boolean> => {
  const sql = `
        SELECT 1 FROM recipes WHERE image_url LIKE $1
        UNION
        SELECT 1 FROM instructions WHERE image_url LIKE $1
        LIMIT 1;
    `
  const res = await query(sql, [`%${publicId}%`])
  return (res.rowCount ?? 0) > 0
}

const updateRecipeStatus = async (id: number, status: RecipeStatus, rejection_reason?: string) => {
  /*sql*/
  const updateSql = `
        UPDATE recipes
        SET status = $1, rejection_reason = $3
        WHERE id = $2
        `
  await query(updateSql, [status, id, rejection_reason])
}

const increaseRecipeViewCount = async (id: number) => {
  /*sql*/
  const updateSql = `
        UPDATE recipes
        SET view_count = view_count + 1
        WHERE id = $1
    `
  await query(updateSql, [id])
}

const batchIncrementRecipeViewCounts = async (
  entries: Array<{ id: number; views: number }>
): Promise<number> => {
  if (!entries || entries.length === 0) {
    return 0
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    let totalUpdated = 0
    for (const { id, views } of entries) {
      const res = await client.query(
        `UPDATE recipes SET view_count = view_count + $1 WHERE id = $2`,
        [views, id]
      )
      totalUpdated += res.rowCount ?? 0
    }
    await client.query("COMMIT")
    return totalUpdated
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export {
  findAllRecipes,
  findRecipeById,
  createRecipe,
  getAllUsedImageUrls,
  isImageUsedInRecipe,
  deleteRecipe,
  updateRecipe,
  updateRecipeStatus,
  increaseRecipeViewCount,
  batchIncrementRecipeViewCounts,
}
