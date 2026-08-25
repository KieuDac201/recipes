import { NextFunction, Request, Response } from "express"
import { userService } from "../services/user.service"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json({
      message: "Đăng ký tài khoản thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.",
      user,
    })
  } catch (error) {
    next(error)
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
}

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.body.token || req.query.token) as string
    const result = await userService.verifyEmail(token)
    res.cookie("token", result.token, COOKIE_OPTIONS)
    res.status(200).json({ message: "Kích hoạt tài khoản thành công!", ...result })
  } catch (error) {
    next(error)
  }
}

const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.resendVerificationEmail(req.body.email)
    res.status(200).json({ message: "Đã gửi lại email kích hoạt thành công. Vui lòng kiểm tra hộp thư." })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.loginUser(req.body)
    res.cookie("token", user.token, COOKIE_OPTIONS)
    res.status(200).json({ message: "User logged in successfully", user })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.forgotPassword(req.body.email)
    res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password } = req.body
    await userService.resetPassword(email, otp, password)
    res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
}
