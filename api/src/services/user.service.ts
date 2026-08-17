import { userRepository } from "../repositories/user.repository";
import { UserPayload } from "../types/user.type";
import { comparePassword, hashPassword } from "../utils";
import { AppError } from "../utils/AppError";
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET;

const createUser = async (user: UserPayload) => {
    const existUser = await userRepository.findUserByEmail(user.email);

    if (existUser) {
        throw new AppError("User already exists", 400);
    }

    const hashedPassword = await hashPassword(user.password);
    const newUser = await userRepository.createUser({ email: user.email, password: hashedPassword });

    return newUser;
}

const loginUser = async (user: UserPayload) => {
    const existUser = await userRepository.findUserByEmail(user.email);

    if (!existUser) {
        throw new AppError('Email or password is not correct', 401)
    }

    const isPasswordValid = await comparePassword(user.password, existUser.password_hash);

    if (!isPasswordValid) {
        throw new AppError("Email or password is not correct", 401)
    }

    const token = jwt.sign({ email: existUser.email, role: existUser.role }, SECRET_KEY!, { expiresIn: "1d" })

    return {
        user: {
            email: existUser.email,
            role: existUser.role,
        },
        token,
    };
}

export const userService = {
    createUser,
    loginUser
}