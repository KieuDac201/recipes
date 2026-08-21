import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError"
import jwt from "jsonwebtoken"
import { User } from "../types/user.type"

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const accessToken = authHeader ? authHeader.split(" ")[1] : null

  if (!accessToken) {
    return next(new AppError("Unauthorized: Vui lòng đăng nhập để tiếp tục.", 401))
  }

  jwt.verify(accessToken, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Unauthorized: Phiên đăng nhập đã hết hạn."
          : "Unauthorized: Token xác thực không hợp lệ."
      return next(new AppError(message, 401))
    }

    req.user = user as User
    next()
  })
}

const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== "admin") {
      throw new AppError(
        "Forbidden: Bạn không có quyền quản trị viên để thực hiện hành động này.",
        403
      )
    }
    next()
  } catch (error) {
    next(error)
  }
}

const verifyCronSecret = (req: Request, res: Response, next: NextFunction) => {
  const cronSecret = process.env.CRON_SECRET
  const providedSecret =
    (req.headers["x-cron-secret"] as string) ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined)

  if (!cronSecret) {
    return next(
      new AppError("Server configuration error: CRON_SECRET is not configured", 500)
    )
  }

  if (!providedSecret || providedSecret !== cronSecret) {
    return next(new AppError("Unauthorized: Invalid or missing cron secret", 401))
  }

  next()
}

export { verifyToken, authAdmin, verifyCronSecret }
