import morgan from "morgan"
import { Request, Response } from "express"

const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[90m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
}

const colorizeStatus = (status: number): string => {
  if (status >= 500) return `${colors.red}${status}${colors.reset}`
  if (status >= 400) return `${colors.yellow}${status}${colors.reset}`
  if (status >= 300) return `${colors.cyan}${status}${colors.reset}`
  if (status >= 200) return `${colors.green}${status}${colors.reset}`
  return `${status}`
}

/**
 * Extracts the real client public IP from proxy headers (Cloudflare / Render / ISP hops)
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string") {
    // The leftmost IP in X-Forwarded-For is the original client public IP
    return forwarded.split(",")[0].trim()
  }
  return (
    (req.headers["cf-connecting-ip"] as string) ||
    (req.headers["x-real-ip"] as string) ||
    req.ip ||
    req.socket?.remoteAddress ||
    "-"
  )
}

// Register custom colorful format with Morgan
morgan.format("render-colorful", (tokens, req: Request, res: Response) => {
  const status = Number(tokens.status(req, res)) || 0
  const timestamp = `${colors.dim}[${new Date().toISOString()}]${colors.reset}`
  const ip = `${colors.blue}${getClientIp(req)}${colors.reset}`
  const method = `${colors.magenta}${tokens.method(req, res)}${colors.reset}`
  const url = tokens.url(req, res)
  const statusFormatted = colorizeStatus(status)
  const responseTime = `${tokens["response-time"](req, res) || "0"} ms`

  return [timestamp, ip, method, url, statusFormatted, responseTime].join(" ")
})

// HTTP Request Logger Middleware
export const httpLogger = morgan("render-colorful", {
  // Skip logging wake-up pings to prevent cluttering console logs
  skip: (req) => req.url === "/wake-up",
})
