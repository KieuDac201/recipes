import express, { Request, Response } from 'express'
import { query } from './config/db.js'
import router from './routes'

const app = express()

app.use(express.json())

app.use("/api", router)

app.get("/health", async (req: Request, res: Response) => {
    try {
        const result = await query("SELECT NOW()")
        res.json({ status: "Success", dbTime: result.rows[0].now })
    } catch (error: any) {
        res.status(500).json({ status: "Error", error: error.message })
    }
})

export default app