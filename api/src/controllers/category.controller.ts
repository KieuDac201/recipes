import { Request, Response, NextFunction } from "express"
import { sendSuccess } from "../utils/response"
import { categoryService } from "../services/category.service"

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.findAllCategories()
    return sendSuccess(res, categories, 200)
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCategory = await categoryService.createCategory(req.body)
    return sendSuccess(res, newCategory, 201)
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updatedCategory = await categoryService.updateCategory(Number(id), req.body)
    return sendSuccess(res, updatedCategory, 200)
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const deletedCategory = await categoryService.deleteCategory(Number(id))
    return sendSuccess(res, deletedCategory, 200)
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}


