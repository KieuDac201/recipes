import nodemailer from "nodemailer"

const user = process.env.GMAIL_USER || process.env.SMTP_USER
const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
})

export default transporter
