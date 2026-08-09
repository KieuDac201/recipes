import { getAllRecipes } from "../services/recipe.service"
import { NextFunction, Request, Response } from "express"

const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes = await getAllRecipes()
        res.status(200).json({
            success: true,
            count: recipes.length,
            data: recipes
        })
    } catch (error) {
        next(error)
    }
}

export {
    getRecipes
}