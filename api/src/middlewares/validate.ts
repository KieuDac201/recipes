import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/AppError";

export const validateQuery = (schema: ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

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

        next();
    };
};

export const validateBody = (schema: ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const formattedErrors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return next(new AppError("Invalid request body", 400, formattedErrors));
        }
        req.body = result.data;

        next();
    };
};

export default validateQuery;