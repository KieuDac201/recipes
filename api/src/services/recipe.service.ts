import * as RecipeRepository from "../repositories/recipe.repository";
import { Recipe, RecipeBody, RecipeDetail } from "../types/recipe.type";
import { AppError } from "../utils/AppError";
import { confirmImages, extractPublicIdFromUrl } from "./upload.service";

export const getAllRecipes = async (limit: number, currentPage: number, search?: string): Promise<{ recipes: Recipe[], totalPage: number }> => {
    const offset = (currentPage - 1) * limit;

    return await RecipeRepository.findAllRecipes(limit, offset, search)
}

export const getRecipeById = async (id: string): Promise<RecipeDetail> => {
    const recipe = await RecipeRepository.findRecipeById(id)

    if (!recipe) {
        throw new AppError("Not Found", 404)
    }
    return recipe
}

export const postRecipe = async (recipe: RecipeBody): Promise<Recipe> => {
    const createdRecipe = await RecipeRepository.createRecipe(recipe);

    const publicIdsToConfirm: string[] = [];
    if (recipe.image_url) {
        const mainImageId = extractPublicIdFromUrl(recipe.image_url);
        if (mainImageId) publicIdsToConfirm.push(mainImageId);
    }
    if (recipe.instructions && recipe.instructions.length > 0) {
        for (const step of recipe.instructions) {
            if (step.image_url) {
                const stepImageId = extractPublicIdFromUrl(step.image_url);
                if (stepImageId) publicIdsToConfirm.push(stepImageId);
            }
        }
    }
    // 3. Gỡ tag "temporary" để xác nhận ảnh chính thức
    if (publicIdsToConfirm.length > 0) {
        await confirmImages(publicIdsToConfirm);
    }
    return createdRecipe;
}