import { userRepository } from "../repositories/user.repository";
import { UserPayload } from "../types/user.type";
import { comparePassword, hashPassword } from "../utils";
import { AppError } from "../utils/AppError";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import sendMail from "./email.service";

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

    const token = jwt.sign({ id: existUser.id, email: existUser.email, role: existUser.role }, SECRET_KEY!, { expiresIn: "1d" })

    return {
        user: {
            id: existUser.id,
            email: existUser.email,
            role: existUser.role,
        },
        token,
    };
}

const forgotPassword = async (email?: string) => {
    if (!email) {
        throw new AppError("Email is required", 400);
    }
    const existUser = await userRepository.findUserByEmail(email);

    if (!existUser) {
        throw new AppError('Email not found', 404)
    }
    // check lock until
    const now = new Date();
    if (existUser.reset_otp_locked_until && new Date(existUser.reset_otp_locked_until) > now) {
        throw new AppError('You have requested too many reset codes. Please try again later.', 429)
    }

    // gen otp
    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    // hash otp
    const hashedOtp = crypto.createHash('sha256').update(rawOtp).digest('hex')
    // send mail
    await sendMail(email, 'Reset Password', `Your reset OTP is: ${rawOtp}`);
    // save to database (otp, expired = 1p, reset_otp_attempts = 0 )
    await userRepository.saveOtp(email, hashedOtp, new Date(Date.now() + 10 * 60 * 1000))

}

const resetPassword = async (email: string, otp: string, password: string) => {
    if (!email || !otp || !password) {
        throw new AppError('Missing required fields', 400);
    }

    const existUser = await userRepository.findUserByEmail(email);

    if (!existUser) {
        throw new AppError('Email not found', 404)
    }
    // check reset_otp_attempts >= 5 
    if (existUser.reset_otp_attempts >= 5) {
        const oneDay = 24 * 60 * 60 * 1000;

        await userRepository.lockResetOtp(email, new Date(Date.now() + oneDay))
        throw new AppError('You have exceeded the maximum number of reset attempts. Please try again later.', 429)
    }
    const now = new Date();
    // check reset_otp_expires_at
    if (existUser.reset_otp_expires_at && new Date(existUser.reset_otp_expires_at) < now) {
        throw new AppError('Invalid or expired reset code.', 400)
    }

    // verify otp
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashedOtp !== existUser.reset_otp_hash) {
        await userRepository.incrementResetAttempts(email);
        throw new AppError('Invalid or expired reset code.', 400);
    }

    // reset password
    const hashedPassword = await hashPassword(password);
    await userRepository.updatePassword(email, hashedPassword);
    // clear otp


}

export const userService = {
    createUser,
    loginUser,
    forgotPassword,
    resetPassword
}