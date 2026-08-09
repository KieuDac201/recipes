import * as RecipeRepository from "../repositories/recipe.repository";
import { Recipe } from "../types/recipe.type";

export const getAllRecipes = async (): Promise<Recipe[]> => {
    return await RecipeRepository.findAllRecipes()
}