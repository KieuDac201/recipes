import multer from 'multer'
import { Request } from 'express'
import { AppError } from '../utils/AppError'

const storage = multer.memoryStorage()

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new AppError("Invalid file type, only images are allowed", 400))
    }
}

export const uploadSingleImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single("file")