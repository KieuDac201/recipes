import transporter from "../config/email"
import { AppError } from "../utils/AppError"

const sendMail = async (email: string, subject: string, html: string) => {
  const fromUser = process.env.GMAIL_USER
  const fromName = "Bếp Phương"
  const from = `"${fromName}" <${fromUser}>`

  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      html,
    })

    return info
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] [EMAIL] ❌ Error sending email to ${email}:`,
      error
    )
    if (error instanceof AppError) throw error
    throw new AppError(`Error sending email: ${error.message || "Failed to send"}`, 500)
  }
}

export default sendMail
