import { query } from "../config/db"
import { CreateUserSchemaType } from "../schemas/user.schema"
import { User } from "../types/user.type"

const findUserByEmail = async (email: string): Promise<User | null> => {
  const getUserSql = `
        SELECT * FROM users WHERE email = $1
    `
  const users = await query(getUserSql, [email])
  return users.rows[0] || null
}

const createUser = async (user: CreateUserSchemaType) => {
  /*sql*/
  const insertUserSql = `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING email, role, created_at
    `

  const result = await query(insertUserSql, [user.email, user.password])
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
        SET reset_otp_attempts = reset_otp_attempts + 1
        WHERE email = $1
    `
  await query(updateAttemptsSql, [email])
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

export const userRepository = {
  createUser,
  findUserByEmail,
  saveOtp,
  incrementResetAttempts,
  lockResetOtp,
  updatePassword,
}
