import { Request, Response, NextFunction } from "express";
import { cleanOrphanedImages, uploadImageToCloudinary } from "../services/upload.service";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new AppError("No file uploaded. Please attach a file with key 'file'", 400);
        }

        const result = await uploadImageToCloudinary(req.file.buffer, "recipes");

        return sendSuccess(res, result, 201);
    } catch (error) {
        next(error);
    }
};

export const cleanUpImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cleanOrphanedImages();
        return sendSuccess(res, {
            message: "Cleanup completed"
        }, 200);
    } catch (error) {
        next(error);
    }
}