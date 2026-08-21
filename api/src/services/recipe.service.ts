import * as RecipeRepository from "../repositories/recipe.repository"
import { Recipe, RecipeBody, RecipeDetail, RecipeStatus } from "../types/recipe.type"
import { AppError } from "../utils/AppError"
import { confirmImages, extractPublicIdFromUrl } from "./upload.service"

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

const removeTempTagImages = async (recipe: RecipeBody) => {
  const publicIdsToConfirm: string[] = []
  if (recipe.image_url) {
    const mainImageId = extractPublicIdFromUrl(recipe.image_url)
    if (mainImageId) publicIdsToConfirm.push(mainImageId)
  }
  if (recipe.instructions && recipe.instructions.length > 0) {
    for (const step of recipe.instructions) {
      if (step.image_url) {
        const stepImageId = extractPublicIdFromUrl(step.image_url)
        if (stepImageId) publicIdsToConfirm.push(stepImageId)
      }
    }
  }
  // 3. Gỡ tag "temporary" để xác nhận ảnh chính thức
  if (publicIdsToConfirm.length > 0) {
    await confirmImages(publicIdsToConfirm)
  }
}

const postRecipe = async (recipe: RecipeBody): Promise<Recipe> => {
  const createdRecipe = await RecipeRepository.createRecipe(recipe)

  await removeTempTagImages(recipe)

  return createdRecipe
}

const updateRecipe = async (
  id: string,
  recipe: RecipeBody
): Promise<Omit<Recipe, "created_at">> => {
  const updatedRecipe = await RecipeRepository.updateRecipe(id, recipe)

  await removeTempTagImages(recipe)

  return updatedRecipe
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
