import * as RecipeRepository from "../repositories/recipe.repository";
import { Recipe } from "../types/recipe.type";

export const getAllRecipes = async (limit: number, currentPage: number): Promise<{ recipes: Recipe[], totalPage: number }> => {
    const offset = (currentPage - 1) * limit;

    return await RecipeRepository.findAllRecipes(limit, offset)
}