interface UserPayload {
    email: string;
    password: string;
}

interface User {
    id: number;
    email: string;
    role: string;
    password_hash: string
    reset_otp_locked_until: string | null;
    reset_otp_attempts: number;
    reset_otp_hash: string | null;
    reset_otp_expires_at: string | null;
}

interface ForgotPasswordPayload {
    email: string;
}

interface ResetPasswordPayload {
    email: string;
    otp: string;
    password: string;
}

export {
    UserPayload,
    User,
    ForgotPasswordPayload,
    ResetPasswordPayload
}