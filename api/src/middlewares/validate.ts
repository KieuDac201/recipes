import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/AppError";

const validateQuery = (schema: ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query)

        if (!result.success) {
            const formattedErrors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return next(new AppError("Invalid query parameters", 400, formattedErrors));
        }
        Object.defineProperty(req, "query", {
            value: result.data,
            writable: true,
            enumerable: true,
            configurable: true,
        });

        next()
    }
}

export default validateQuery