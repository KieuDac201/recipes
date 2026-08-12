import express from "express";
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { getOpenApiDocumentation } from "./docs/openapi";

const app = express();

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Main API routes
app.use("/api", router);

// Serve OpenAPI Specification JSON and Swagger UI
const openApiDoc = getOpenApiDocumentation();
app.get("/docs.json", (req, res) => {
    res.json(openApiDoc);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

// Global Error Handler
app.use(errorHandler);

export default app;