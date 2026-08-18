import RecipeService from "../services/recipe.service"
import { NextFunction, Request, Response } from "express"
import { sendSuccess } from "../utils/response"
import {
    GetPublicRecipesQuery,
    GetMyRecipesQuery,
    GetAdminRecipesQuery,
} from "../schemas/recipe.schema";

const getPublicRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, current_page: currentPage, search } = req.query as unknown as GetPublicRecipesQuery;

        const { recipes, totalPage } = await RecipeService.getPublicRecipes(limit, currentPage, search)

        return sendSuccess(res, recipes, 200, {
            currentPage,
            totalPage,
            limit
        })

    } catch (error) {
        next(error)
    }
}

const getMyRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, current_page: currentPage, search, status } = req.query as unknown as GetMyRecipesQuery;
        const { id: authorId } = req.user as { id: number };
        const { recipes, totalPage } = await RecipeService.getMyRecipes(limit, currentPage, search, status, authorId)

        return sendSuccess(res, recipes, 200, {
            currentPage,
            totalPage,
            limit
        })

    } catch (error) {
        next(error)
    }
}
const getAdminRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, current_page: currentPage, search, status } = req.query as unknown as GetAdminRecipesQuery;
        const { recipes, totalPage } = await RecipeService.getAdminRecipes(limit, currentPage, search, status)

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
        const { id: authorId } = req.user as { id: number };
        const recipe = await RecipeService.postRecipe({ ...req.body, author_id: authorId });
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

const updateRecipeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, rejection_reason } = req.body;
        const { id } = req.params as { id: string };
        await RecipeService.updateRecipeStatus(Number(id), status, rejection_reason);
        return sendSuccess(res, { message: 'Update status successfully' }, 200)
    } catch (error) {
        next(error)
    }
}

const RecipeController = {
    getAdminRecipes,
    getPublicRecipes,
    getMyRecipes,
    getRecipe,
    createRecipe,
    deleteRecipe,
    updateRecipe,
    updateRecipeStatus
}

export default RecipeController