import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        next(error);
    }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.loginUser(req.body);
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        next(error);
    }
}

export const userController = {
    createUser,
    loginUser
}