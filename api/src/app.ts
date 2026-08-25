import express from "express"
import swaggerUi from "swagger-ui-express"
import router from "./routes"
import { errorHandler } from "./middlewares/errorHandler"
import { getOpenApiDocumentation } from "./docs/openapi"
import { httpLogger, getClientIp } from "./utils/logger"
import rateLimit from "express-rate-limit"

const app = express()

// Trust proxy (trust all proxy hops on Render/Cloudflare so real client IP is resolved)
app.set("trust proxy", true)

// HTTP request logging to stdout (Render console / terminal)
app.use(httpLogger)

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 200, // Tối đa 200 requests/IP
  message: "Too many requests from this IP, please try again after 10 minutes",
  skip: (req) => getClientIp(req) === "119.17.205.204",
})

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN || "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

app.use(apiLimiter)

app.use(express.json())

// CORS middleware

app.get("/wake-up", (req, res) => {
  res.json({ message: "I'm alive" })
})

// ⚠️ TEMPORARY: Debug endpoint to inspect all IP-related headers on Render
// DELETE this after identifying the correct header
app.get("/debug-ip", (req, res) => {
  res.json({
    "req.ip": req.ip,
    "req.ips": req.ips,
    "req.socket.remoteAddress": req.socket?.remoteAddress,
    "x-forwarded-for": req.headers["x-forwarded-for"],
    "x-real-ip": req.headers["x-real-ip"],
    "cf-connecting-ip": req.headers["cf-connecting-ip"],
    "true-client-ip": req.headers["true-client-ip"],
    "x-client-ip": req.headers["x-client-ip"],
    "x-forwarded-proto": req.headers["x-forwarded-proto"],
    "forwarded": req.headers["forwarded"],
    allHeaders: req.headers,
  })
})

// Main API routes
app.use("/api", router)

// Serve OpenAPI Specification JSON and Swagger UI
const openApiDoc = getOpenApiDocumentation()
app.get("/docs.json", (req, res) => {
  res.json(openApiDoc)
})
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc))

// Global Error Handler
app.use(errorHandler)

export default app
