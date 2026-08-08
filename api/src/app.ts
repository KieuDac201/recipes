import express, { Application, Request, Response } from 'express'
import { query } from './config/db.js'

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "abc" })
})

app.get("/health", async (req, res) => {
    try {
        const result = await query("SELECT NOW()")
        res.json({ status: "Success", dbTime: result.rows[0].now })
    } catch (error: any) {
        res.status(500).json({ status: "Error", error: error.message })
    }
})

export default app