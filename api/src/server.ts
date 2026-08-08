import "dotenv/config"
import app from "./app.js"
import { pool } from "./config/db.js"

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        const res = await pool.query("SELECT NOW()")
        console.log(" Connected to PostgreSQL at:", res.rows[0].now);

        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1);
    }
}

startServer()