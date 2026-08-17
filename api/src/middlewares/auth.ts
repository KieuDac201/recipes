import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { User } from "../types/user.type";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const accessToken = authHeader ? authHeader.split(' ')[1] : null

    if (!accessToken) {
        throw new AppError("Unauthorized", 401);
    }

    jwt.verify(accessToken, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return next(new AppError("Unauthorized", 401));
        }

        req.user = user as User;
        next();
    })
}

const authAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new AppError("Unauthorized", 401);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export { verifyToken, authAdmin }