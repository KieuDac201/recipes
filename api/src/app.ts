import express from "express"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import router from "./routes"
import { errorHandler } from "./middlewares/errorHandler"
import { getOpenApiDocumentation } from "./docs/openapi"
import rateLimit from "express-rate-limit"

const app = express()

// HTTP request logging to stdout (Render console / terminal)
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    // Skip logging wake-up pings to prevent cluttering console logs
    skip: (req) => req.url === "/wake-up",
  })
)

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 200, // Tối đa 200 requests/IP
  message: "Too many requests from this IP, please try again after 10 minutes",
  skip: ({ ip }) => ip === "119.17.205.204",
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
