import RecipeService from "../services/recipe.service"
import { NextFunction, Request, Response } from "express"
import { sendSuccess } from "../utils/response"
import { GetRecipesQuery } from "../schemas/recipe.schema";

const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, current_page: currentPage, search } = req.query as unknown as GetRecipesQuery;

        const { recipes, totalPage } = await RecipeService.getAllRecipes(limit, currentPage, search)

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
        const recipe = await RecipeService.getRecipeById(id);
        return sendSuccess(res, recipe, 200)
    } catch (error) {
        next(error)
    }
}

const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipe = await RecipeService.postRecipe(req.body);
        return sendSuccess(res, recipe, 201)
    } catch (error) {
        next(error)
    }
}

const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const recipe = await RecipeService.updateRecipe(id, req.body);
        return sendSuccess(res, recipe, 200)
    } catch (error) {
        next(error)
    }

}

const deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        const recipe = await RecipeService.removeRecipe(id);
        return sendSuccess(res, recipe, 200)
    } catch (error) {
        next(error)
    }
}
const RecipeController = {
    getRecipes,
    getRecipe,
    createRecipe,
    deleteRecipe,
    updateRecipe
}

export default RecipeController