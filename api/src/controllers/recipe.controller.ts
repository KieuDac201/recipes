import { getAllRecipes, getRecipeById } from "../services/recipe.service"
import { NextFunction, Request, Response } from "express"
import { sendSuccess } from "../utils/response"
import { GetRecipesQuery } from "../schemas/recipe.schema";

const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, current_page: currentPage, search } = req.query as unknown as GetRecipesQuery;

        const { recipes, totalPage } = await getAllRecipes(limit, currentPage, search)

        return sendSuccess(res, recipes, 200, {
            currentPage,
            totalPage,
            limit
        })

    } catch (error) {
        next(error)
    }
}

const getRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const recipe = await getRecipeById(id);
        return sendSuccess(res, recipe, 200)
    } catch (error) {
        next(error)
    }
}

export {
    getRecipes,
    getRecipe
}