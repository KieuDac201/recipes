// src/utils/response.ts
import { Response } from "express"

interface PaginationMeta {
  currentPage?: number
  totalPage?: number
  totalCount?: number
  limit?: number
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  pagination?: PaginationMeta
) => {
  return res.status(statusCode).json({
    success: true,
    ...(pagination && { pagination }),
    data,
  })
}

export const sendError = (res: Response, message: string, statusCode = 500, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
  })
}
