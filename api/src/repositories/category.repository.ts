import { query } from "../config/db"
import { Category, UpdateCategoryBody } from "../types/category.type"

const findAllCategories = async (): Promise<Category[]> => {
  /*sql*/
  const sql = `SELECT * FROM categories ORDER BY id ASC`
  const result = await query(sql)
  return result.rows
}

const findCategoryById = async (id: number): Promise<Category | null> => {
  /*sql*/
  const sql = `SELECT * FROM categories WHERE id = $1`
  const result = await query(sql, [id])
  return result.rows[0] || null
}

const findCategoryByNameOrSlug = async (
  name: string,
  slug: string
): Promise<Category | null> => {
  /*sql*/
  const sql = `SELECT * FROM categories WHERE LOWER(name) = LOWER($1) OR slug = $2 LIMIT 1`
  const result = await query(sql, [name, slug])
  return result.rows[0] || null
}

const createCategory = async (data: { name: string; slug: string }): Promise<Category> => {
  /*sql*/
  const sql = `
    INSERT INTO categories (name, slug)
    VALUES ($1, $2)
    RETURNING *
  `
  const result = await query(sql, [data.name, data.slug])
  return result.rows[0]
}

const updateCategory = async (
  id: number,
  data: UpdateCategoryBody
): Promise<Category | null> => {
  /*sql*/
  const sql = `
    UPDATE categories
    SET name = COALESCE($1, name),
        slug = COALESCE($2, slug)
    WHERE id = $3
    RETURNING *
  `
  const result = await query(sql, [data.name, data.slug, id])
  return result.rows[0] || null
}

const deleteCategory = async (id: number): Promise<Category | null> => {
  /*sql*/
  const sql = `
    DELETE FROM categories
    WHERE id = $1
    RETURNING *
  `
  const result = await query(sql, [id])
  return result.rows[0] || null
}

export const categoryRepository = {
  findAllCategories,
  findCategoryById,
  findCategoryByNameOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
}

