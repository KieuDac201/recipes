import nodemailer from "nodemailer"
import dns from "node:dns"

// Fix lỗi IPv6 unreachable trên môi trường Cloud / Docker
dns.setDefaultResultOrder("ipv4first")

const user = process.env.GMAIL_USER
const pass = process.env.GMAIL_APP_PASSWORD

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user,
    pass,
  },
})

export default transporter
