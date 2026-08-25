// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || "Internal Server Error"
  const details = err instanceof AppError ? err.details : undefined

  // Log unhandled server errors (5xx) with stack traces to Render console / stdout
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] [ERROR] ${req.method} ${req.originalUrl}:`, err)
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
  })
}
