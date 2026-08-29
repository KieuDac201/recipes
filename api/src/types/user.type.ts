interface UserPayload {
  email: string
  password: string
}

interface User {
  id: number
  email: string
  role: string
  password_hash?: string | null
  is_email_verified: boolean
  email_verification_token: string | null
  email_verification_expires_at: string | null
  reset_otp_locked_until: string | null
  reset_otp_attempts: number
  reset_otp_hash: string | null
  reset_otp_expires_at: string | null
  google_id?: string | null
  facebook_id?: string | null
  avatar_url?: string | null
  auth_provider?: string
  created_at: string
}

interface ForgotPasswordPayload {
  email: string
}

interface ResetPasswordPayload {
  email: string
  otp: string
  password: string
}

interface VerifyEmailPayload {
  token: string
}

interface ResendVerificationPayload {
  email: string
}

interface GoogleLoginPayload {
  idToken: string
}

interface FacebookLoginPayload {
  accessToken: string
}

export {
  UserPayload,
  User,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  ResendVerificationPayload,
  GoogleLoginPayload,
  FacebookLoginPayload,
}
