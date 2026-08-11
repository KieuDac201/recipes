import * as RecipeRepository from "../repositories/recipe.repository";
import { Recipe } from "../types/recipe.type";
import { AppError } from "../utils/AppError";

export const getAllRecipes = async (limit: number, currentPage: number, search?: string): Promise<{ recipes: Recipe[], totalPage: number }> => {
    const offset = (currentPage - 1) * limit;

    return await RecipeRepository.findAllRecipes(limit, offset, search)
}

export const getRecipeById = async (id: string): Promise<Recipe> => {
    const recipe = await RecipeRepository.findRecipeById(id)

    if (!recipe) {
        throw new AppError("Not Found", 404)
    }
    return recipe
}