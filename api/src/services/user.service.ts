import { userRepository } from "../repositories/user.repository"
import { UserPayload } from "../types/user.type"
import { comparePassword, hashPassword } from "../utils"
import { AppError } from "../utils/AppError"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library"
import sendMail from "./email.service"
import { generateOtpEmailHtml } from "../templates/otpEmail.template"
import { generateVerificationEmailHtml } from "../templates/verifyEmail.template"

const SECRET_KEY = process.env.JWT_SECRET
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const createUser = async (user: UserPayload) => {
  const existUser = await userRepository.findUserByEmail(user.email)

  if (existUser) {
    throw new AppError("Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.", 400)
  }

  const hashedPassword = await hashPassword(user.password)

  // Generate secure 32-byte hex token for magic link email verification
  const rawVerificationToken = crypto.randomBytes(32).toString("hex")
  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(rawVerificationToken)
    .digest("hex")
  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours validity

  const newUser = await userRepository.createUser({
    email: user.email,
    passwordHash: hashedPassword,
    verificationTokenHash: hashedVerificationToken,
    verificationExpiresAt,
  })

  // Send activation magic link email
  const clientUrl = process.env.CLIENT_URL || "http://localhost:8888"
  const verificationUrl = `${clientUrl}/verify-email?token=${rawVerificationToken}&email=${encodeURIComponent(user.email)}`
  const emailHtml = generateVerificationEmailHtml(verificationUrl)

  try {
    await sendMail(user.email, "Kích Hoạt Tài Khoản — Bếp Phương", emailHtml)
  } catch (error) {
    console.error("⚠️ Failed to send verification email during registration:", error)
  }

  return newUser
}

const loginUser = async (user: UserPayload) => {
  const existUser = await userRepository.findUserByEmail(user.email)

  if (!existUser) {
    throw new AppError("Email hoặc mật khẩu không chính xác.", 401)
  }

  const isPasswordValid = await comparePassword(user.password, existUser.password_hash)

  if (!isPasswordValid) {
    throw new AppError("Email hoặc mật khẩu không chính xác.", 401)
  }

  // Enforce email verification check
  if (!existUser.is_email_verified) {
    throw new AppError(
      "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email của bạn để xác thực tài khoản.",
      403
    )
  }

  const token = jwt.sign(
    { id: existUser.id, email: existUser.email, role: existUser.role },
    SECRET_KEY!,
    { expiresIn: "1d" }
  )

  return {
    user: {
      id: existUser.id,
      email: existUser.email,
      role: existUser.role,
    },
    token,
  }
}

const verifyEmail = async (token: string) => {
  if (!token || typeof token !== "string") {
    throw new AppError("Mã kích hoạt không hợp lệ.", 400)
  }

  const hashedToken = crypto.createHash("sha256").update(token.trim()).digest("hex")
  const existUser = await userRepository.findUserByVerificationToken(hashedToken)

  if (!existUser) {
    throw new AppError(
      "Đường dẫn kích hoạt không hợp lệ hoặc tài khoản đã được kích hoạt trước đó.",
      400
    )
  }

  const now = new Date()
  if (
    existUser.email_verification_expires_at &&
    new Date(existUser.email_verification_expires_at) < now
  ) {
    throw new AppError(
      "Đường dẫn kích hoạt đã hết hạn (quá 24h). Vui lòng yêu cầu gửi lại email xác thực.",
      400
    )
  }

  const verifiedUser = await userRepository.verifyUserEmail(existUser.id)

  // Automatically generate JWT session token upon successful email verification
  const sessionToken = jwt.sign(
    { id: verifiedUser.id, email: verifiedUser.email, role: verifiedUser.role },
    SECRET_KEY!,
    { expiresIn: "1d" }
  )

  return {
    user: {
      id: verifiedUser.id,
      email: verifiedUser.email,
      role: verifiedUser.role,
    },
    token: sessionToken,
  }
}

const resendVerificationEmail = async (email?: string) => {
  if (!email) {
    throw new AppError("Email là bắt buộc.", 400)
  }

  const existUser = await userRepository.findUserByEmail(email)

  if (!existUser) {
    throw new AppError("Không tìm thấy tài khoản với email này.", 404)
  }

  if (existUser.is_email_verified) {
    throw new AppError("Tài khoản này đã được kích hoạt trước đó. Vui lòng đăng nhập.", 400)
  }

  // Generate a new verification token
  const rawVerificationToken = crypto.randomBytes(32).toString("hex")
  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(rawVerificationToken)
    .digest("hex")
  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await userRepository.saveEmailVerificationToken(
    email,
    hashedVerificationToken,
    verificationExpiresAt
  )

  const clientUrl = process.env.CLIENT_URL || "http://localhost:8888"
  const verificationUrl = `${clientUrl}/verify-email?token=${rawVerificationToken}&email=${encodeURIComponent(email)}`
  const emailHtml = generateVerificationEmailHtml(verificationUrl)

  await sendMail(email, "Kích Hoạt Tài Khoản — Bếp Phương", emailHtml)
}

const forgotPassword = async (email?: string) => {
  if (!email) {
    throw new AppError("Email is required", 400)
  }
  const existUser = await userRepository.findUserByEmail(email)

  if (!existUser) {
    return
  }
  // check lock until
  const now = new Date()
  if (existUser.reset_otp_locked_until && new Date(existUser.reset_otp_locked_until) > now) {
    throw new AppError("You have requested too many reset codes. Please try again later.", 429)
  }

  // gen otp
  const rawOtp = crypto.randomInt(100000, 1000000).toString()
  // hash otp
  const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex")
  // send mail
  const emailHtml = generateOtpEmailHtml(rawOtp)
  await sendMail(email, "Mã Xác Thực Đặt Lại Mật Khẩu — Bếp Phương", emailHtml)
  // save to database (otp, expired = 10p, reset_otp_attempts = 0 )
  await userRepository.saveOtp(email, hashedOtp, new Date(Date.now() + 10 * 60 * 1000))
}

const resetPassword = async (email: string, otp: string, password: string) => {
  if (!email || !otp || !password) {
    throw new AppError("Missing required fields", 400)
  }

  const existUser = await userRepository.findUserByEmail(email)

  if (!existUser) {
    throw new AppError("Invalid or expired reset code.", 400)
  }

  // 1. Check if account is currently locked out
  const now = new Date()
  if (existUser.reset_otp_locked_until && new Date(existUser.reset_otp_locked_until) > now) {
    throw new AppError(
      "You have exceeded the maximum number of reset attempts. Please try again later.",
      429
    )
  }

  // 2. Check if OTP is expired
  if (existUser.reset_otp_expires_at && new Date(existUser.reset_otp_expires_at) < now) {
    throw new AppError("Invalid or expired reset code.", 400)
  }

  // 3. Verify OTP
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")
  if (hashedOtp !== existUser.reset_otp_hash) {
    const updated = await userRepository.incrementResetAttempts(email)
    if (updated && updated.reset_otp_attempts >= 5) {
      throw new AppError(
        "You have exceeded the maximum number of reset attempts. Please try again later.",
        429
      )
    }
    throw new AppError("Invalid or expired reset code.", 400)
  }

  // 4. OTP is valid -> Reset password and clear OTP/attempts
  const hashedPassword = await hashPassword(password)
  await userRepository.updatePassword(email, hashedPassword)
}

const googleLogin = async (idToken: string) => {
  if (!idToken || typeof idToken !== "string") {
    throw new AppError("Google ID Token không hợp lệ.", 400)
  }

  let payload
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    payload = ticket.getPayload()
  } catch (error) {
    console.error("⚠️ Google ID Token verification failed:", error)
    throw new AppError("Xác thực tài khoản Google thất bại hoặc phiên đăng nhập đã hết hạn.", 401)
  }

  if (!payload || !payload.email) {
    throw new AppError("Không thể lấy thông tin email từ tài khoản Google của bạn.", 400)
  }

  const googleId = payload.sub
  const email = payload.email.toLowerCase().trim()
  const avatarUrl = payload.picture || null

  // 1. Find user by google_id
  let user = await userRepository.findUserByGoogleId(googleId)

  if (!user) {
    // 2. Check if user exists by email
    const existingUser = await userRepository.findUserByEmail(email)

    if (existingUser) {
      // 3. Link Google account to existing user, preserve password_hash, mark verified
      user = await userRepository.linkGoogleAccount(existingUser.id, googleId, avatarUrl)
    } else {
      // 4. Create new Google user
      user = await userRepository.createGoogleUser({
        email,
        googleId,
        avatarUrl,
      })
    }
  }

  if (!user) {
    throw new AppError("Không thể hoàn tất đăng nhập bằng Google.", 500)
  }

  // 5. Generate application JWT session token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY!,
    { expiresIn: "7d" }
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      auth_provider: user.auth_provider,
    },
    token,
  }
}

export const userService = {
  createUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
}
