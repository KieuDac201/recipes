import resend from "../config/email";
import { AppError } from "../utils/AppError";

const sendMail = async (email: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
            to: email,
            subject: subject,
            html: html
        });

        if (error) {
            console.error("Resend API error:", error);
            throw new AppError(`Failed to send email: ${error.message}`, 500);
        }

        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        if (error instanceof AppError) throw error;
        throw new AppError("Error sending email", 500);
    }
}

export default sendMail;