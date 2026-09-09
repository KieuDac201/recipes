import { NextFunction, Request, Response } from "express"
import { userService } from "../services/user.service"
import { getClientIp } from "../utils/logger"

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

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days sliding window
}

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 minutes
}

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = (req.body.token || req.query.token) as string
    const deviceInfo = (req.headers["user-agent"] as string) || null
    const ipAddress = getClientIp(req) || null

    const result = await userService.verifyEmail(token, deviceInfo, ipAddress)
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
    res.cookie("token", result.accessToken, ACCESS_COOKIE_OPTIONS)
    res.status(200).json({ message: "Kích hoạt tài khoản thành công!", ...result })
  } catch (error) {
    next(error)
  }
}

const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.resendVerificationEmail(req.body.email)
    res.status(200).json({
      message: "Đã gửi lại email kích hoạt thành công. Vui lòng kiểm tra hộp thư.",
    })
  } catch (error) {
    next(error)
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deviceInfo = (req.headers["user-agent"] as string) || null
    const ipAddress = getClientIp(req) || null

    const result = await userService.loginUser(req.body, deviceInfo, ipAddress)
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
    res.cookie("token", result.accessToken, ACCESS_COOKIE_OPTIONS)
    res.status(200).json({ message: "User logged in successfully", user: result })
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

const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body
    const deviceInfo = (req.headers["user-agent"] as string) || null
    const ipAddress = getClientIp(req) || null

    const result = await userService.googleLogin(idToken, deviceInfo, ipAddress)
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
    res.cookie("token", result.accessToken, ACCESS_COOKIE_OPTIONS)
    res.status(200).json({
      message: "Đăng nhập bằng Google thành công!",
      user: result,
    })
  } catch (error) {
    next(error)
  }
}

const facebookLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.body
    const deviceInfo = (req.headers["user-agent"] as string) || null
    const ipAddress = getClientIp(req) || null

    const result = await userService.facebookLogin(accessToken, deviceInfo, ipAddress)
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
    res.cookie("token", result.accessToken, ACCESS_COOKIE_OPTIONS)
    res.status(200).json({
      message: "Đăng nhập bằng Facebook thành công!",
      user: result,
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      (req.headers["x-refresh-token"] as string)

    const deviceInfo = (req.headers["user-agent"] as string) || null
    const ipAddress = getClientIp(req) || null

    const result = await userService.refreshSession(rawToken, deviceInfo, ipAddress)
    res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS)
    res.cookie("token", result.accessToken, ACCESS_COOKIE_OPTIONS)
    res.status(200).json({
      message: "Làm mới phiên đăng nhập thành công!",
      user: result,
    })
  } catch (error) {
    // Clear cookies if refresh fails
    res.clearCookie("refreshToken", { path: "/" })
    res.clearCookie("token", { path: "/" })
    next(error)
  }
}

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken ||
      (req.headers["x-refresh-token"] as string)

    await userService.logoutUser(rawToken)
    res.clearCookie("refreshToken", { path: "/" })
    res.clearCookie("token", { path: "/" })
    res.status(200).json({ message: "Đăng xuất thành công!" })
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
  googleLogin,
  facebookLogin,
  refreshToken,
  logoutUser,
}


