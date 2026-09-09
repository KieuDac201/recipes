import { query } from "../config/db"
import { User } from "../types/user.type"

const findUserByEmail = async (email: string): Promise<User | null> => {
  const getUserSql = `
    SELECT * FROM users WHERE email = $1
  `
  const users = await query(getUserSql, [email])
  return users.rows[0] || null
}

const findUserById = async (id: number): Promise<User | null> => {
  const sql = `SELECT * FROM users WHERE id = $1`
  const result = await query(sql, [id])
  return result.rows[0] || null
}

const findUserByVerificationToken = async (tokenHash: string): Promise<User | null> => {
  const sql = `
    SELECT * FROM users WHERE email_verification_token = $1
  `
  const result = await query(sql, [tokenHash])
  return result.rows[0] || null
}

const createUser = async (data: {
  email: string
  passwordHash: string
  verificationTokenHash: string
  verificationExpiresAt: Date
}): Promise<{ id: number; email: string; role: string; created_at: string }> => {
  const insertUserSql = `
    INSERT INTO users (
      email,
      password_hash,
      is_email_verified,
      email_verification_token,
      email_verification_expires_at
    )
    VALUES ($1, $2, FALSE, $3, $4)
    RETURNING id, email, role, created_at
  `

  const result = await query(insertUserSql, [
    data.email,
    data.passwordHash,
    data.verificationTokenHash,
    data.verificationExpiresAt,
  ])
  return result.rows[0]
}

const saveEmailVerificationToken = async (
  email: string,
  tokenHash: string,
  expiresAt: Date
): Promise<void> => {
  const updateSql = `
    UPDATE users
    SET email_verification_token = $2,
        email_verification_expires_at = $3
    WHERE email = $1
  `
  await query(updateSql, [email, tokenHash, expiresAt])
}

const verifyUserEmail = async (userId: number): Promise<User> => {
  const updateSql = `
    UPDATE users
    SET is_email_verified = TRUE,
        email_verification_token = NULL,
        email_verification_expires_at = NULL
    WHERE id = $1
    RETURNING *
  `
  const result = await query(updateSql, [userId])
  return result.rows[0]
}

const saveOtp = async (email: string, hashedOtp: string, expiresAt: Date) => {
  /*sql*/
  const updateOtpSql = `
    UPDATE users
    SET reset_otp_hash = $2,
        reset_otp_expires_at = $3
    WHERE email = $1
  `
  await query(updateOtpSql, [email, hashedOtp, expiresAt])
}

const lockResetOtp = async (email: string, lockUntil: Date) => {
  /*sql*/
  const lockOtpSql = `
    UPDATE users
    SET reset_otp_locked_until = $2
    WHERE email = $1
  `
  await query(lockOtpSql, [email, lockUntil])
}

const incrementResetAttempts = async (email: string) => {
  /*sql*/
  const updateAttemptsSql = `
    UPDATE users
    SET 
      reset_otp_attempts = reset_otp_attempts + 1,
      reset_otp_locked_until = CASE 
        WHEN reset_otp_attempts + 1 >= 5 THEN NOW() + INTERVAL '1 day'
        ELSE reset_otp_locked_until 
      END
    WHERE email = $1
    RETURNING reset_otp_attempts, reset_otp_locked_until
  `
  const result = await query(updateAttemptsSql, [email])
  return result.rows[0] as {
    reset_otp_attempts: number
    reset_otp_locked_until: Date | null
  } | undefined
}

const updatePassword = async (email: string, passwordHash: string) => {
  /*sql*/
  const updatePasswordSql = `
    UPDATE users
    SET password_hash = $2,
        reset_otp_hash = NULL,
        reset_otp_expires_at = NULL,
        reset_otp_attempts = 0,
        reset_otp_locked_until = NULL
    WHERE email = $1
  `
  await query(updatePasswordSql, [email, passwordHash])
}

const findUserByGoogleId = async (googleId: string): Promise<User | null> => {
  const sql = `SELECT * FROM users WHERE google_id = $1`
  const result = await query(sql, [googleId])
  return result.rows[0] || null
}

const createGoogleUser = async (data: {
  email: string
  googleId: string
  avatarUrl?: string | null
}): Promise<User> => {
  const insertSql = `
    INSERT INTO users (
      email,
      google_id,
      avatar_url,
      auth_provider,
      is_email_verified
    )
    VALUES ($1, $2, $3, 'google', TRUE)
    RETURNING *
  `
  const result = await query(insertSql, [data.email, data.googleId, data.avatarUrl || null])
  return result.rows[0]
}

const linkGoogleAccount = async (
  userId: number,
  googleId: string,
  avatarUrl?: string | null
): Promise<User> => {
  const updateSql = `
    UPDATE users
    SET google_id = $2,
        avatar_url = COALESCE(avatar_url, $3),
        is_email_verified = TRUE
    WHERE id = $1
    RETURNING *
  `
  const result = await query(updateSql, [userId, googleId, avatarUrl || null])
  return result.rows[0]
}

const findUserByFacebookId = async (facebookId: string): Promise<User | null> => {
  const sql = `SELECT * FROM users WHERE facebook_id = $1`
  const result = await query(sql, [facebookId])
  return result.rows[0] || null
}

const createFacebookUser = async (data: {
  email: string
  facebookId: string
  avatarUrl?: string | null
}): Promise<User> => {
  const insertSql = `
    INSERT INTO users (
      email,
      facebook_id,
      avatar_url,
      auth_provider,
      is_email_verified
    )
    VALUES ($1, $2, $3, 'facebook', TRUE)
    RETURNING *
  `
  const result = await query(insertSql, [data.email, data.facebookId, data.avatarUrl || null])
  return result.rows[0]
}

const linkFacebookAccount = async (
  userId: number,
  facebookId: string,
  avatarUrl?: string | null
): Promise<User> => {
  const updateSql = `
    UPDATE users
    SET facebook_id = $2,
        avatar_url = COALESCE(avatar_url, $3),
        is_email_verified = TRUE
    WHERE id = $1
    RETURNING *
  `
  const result = await query(updateSql, [userId, facebookId, avatarUrl || null])
  return result.rows[0]
}

export const userRepository = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByVerificationToken,
  saveEmailVerificationToken,
  verifyUserEmail,
  saveOtp,
  incrementResetAttempts,
  lockResetOtp,
  updatePassword,
  findUserByGoogleId,
  createGoogleUser,
  linkGoogleAccount,
  findUserByFacebookId,
  createFacebookUser,
  linkFacebookAccount,
}
