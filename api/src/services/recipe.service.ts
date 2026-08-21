import * as RecipeRepository from "../repositories/recipe.repository"
import { Recipe, RecipeBody, RecipeDetail, RecipeStatus } from "../types/recipe.type"
import { AppError } from "../utils/AppError"

const getMyRecipes = async (
  limit: number,
  currentPage: number,
  search?: string,
  status?: RecipeStatus,
  authorId?: number
): Promise<{ recipes: Recipe[]; totalPage: number }> => {
  const offset = (currentPage - 1) * limit

  return await RecipeRepository.findAllRecipes(limit, offset, search, status || "all", authorId)
}

const getAdminRecipes = async (
  limit: number,
  currentPage: number,
  search?: string,
  status?: RecipeStatus,
  authorId?: number
): Promise<{ recipes: Recipe[]; totalPage: number; totalCount: number }> => {
  const offset = (currentPage - 1) * limit
  return await RecipeRepository.findAllRecipes(limit, offset, search, status, authorId)
}

const getPublicRecipes = async (
  limit: number,
  currentPage: number,
  search?: string
): Promise<{ recipes: Recipe[]; totalPage: number }> => {
  const offset = (currentPage - 1) * limit
  return await RecipeRepository.findAllRecipes(limit, offset, search, "approved")
}

const getRecipeById = async (id: string): Promise<RecipeDetail> => {
  const recipe = await RecipeRepository.findRecipeById(id)

  if (!recipe) {
    throw new AppError("Not Found", 404)
  }
  return recipe
}

const postRecipe = async (recipe: RecipeBody): Promise<Recipe> => {
  return await RecipeRepository.createRecipe(recipe)
}

const updateRecipe = async (
  id: string,
  recipe: RecipeBody
): Promise<Omit<Recipe, "created_at">> => {
  return await RecipeRepository.updateRecipe(id, recipe)
}

const removeRecipe = async (id: string): Promise<Recipe> => {
  const deletedRecipe = await RecipeRepository.deleteRecipe(id)

  if (!deletedRecipe) {
    throw new AppError("Not Found", 404)
  }
  return deletedRecipe
}

const updateRecipeStatus = async (id: number, status: RecipeStatus, rejection_reason?: string) => {
  await RecipeRepository.updateRecipeStatus(id, status, rejection_reason)
}

const increaseViewCount = async (id: number) => {
  await RecipeRepository.increaseRecipeViewCount(id)
}

const RecipeService = {
  getMyRecipes,
  getPublicRecipes,
  getAdminRecipes,
  getRecipeById,
  postRecipe,
  updateRecipe,
  removeRecipe,
  updateRecipeStatus,
  increaseViewCount,
}

export default RecipeService
