import { categoryRepository } from "../repositories/category.repository"
import { Category, CreateCategoryBody, UpdateCategoryBody } from "../types/category.type"
import { AppError } from "../utils/AppError"
import { slugify } from "../utils/slug"

const findAllCategories = async (): Promise<Category[]> => {
  return await categoryRepository.findAllCategories()
}

const createCategory = async (data: CreateCategoryBody): Promise<Category> => {
  const name = data.name.trim()
  const slug = (data.slug?.trim() || slugify(name))

  const existing = await categoryRepository.findCategoryByNameOrSlug(name, slug)
  if (existing) {
    if (existing.name.toLowerCase() === name.toLowerCase()) {
      throw new AppError("Category with this name already exists", 400)
    }
    if (existing.slug === slug) {
      throw new AppError("Category with this slug already exists", 400)
    }
  }

  return await categoryRepository.createCategory({ name, slug })
}

const updateCategory = async (id: number, data: UpdateCategoryBody): Promise<Category> => {
  const updated = await categoryRepository.updateCategory(id, data)
  if (!updated) {
    throw new AppError("Category not found", 404)
  }
  return updated
}

const deleteCategory = async (id: number): Promise<Category> => {
  const deleted = await categoryRepository.deleteCategory(id)
  if (!deleted) {
    throw new AppError("Category not found", 404)
  }
  return deleted
}

export const categoryService = {
  findAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}


