import { getAllRecipes } from "../services/recipe.service"
import { NextFunction, Request, Response } from "express"
import { sendSuccess } from "../utils/response"
import { GetRecipesQuery } from "../schemas/recipe.schema";

const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit, current_page: currentPage } = req.query as unknown as GetRecipesQuery;

        const { recipes, totalPage } = await getAllRecipes(limit, currentPage)

        return sendSuccess(res, recipes, 200, {
            currentPage,
            totalPage,
            limit
        })

    } catch (error) {
        next(error)
    }
}

export {
    getRecipes
}