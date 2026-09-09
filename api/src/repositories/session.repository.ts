import { query } from "../config/db"
import { RefreshToken } from "../types/auth.type"

const createRefreshToken = async (data: {
  userId: number
  tokenHash: string
  deviceInfo?: string | null
  ipAddress?: string | null
  expiresAt: Date
}): Promise<RefreshToken> => {
  const sql = `
    INSERT INTO refresh_tokens (
      user_id,
      token_hash,
      device_info,
      ip_address,
      expires_at
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `
  const result = await query(sql, [
    data.userId,
    data.tokenHash,
    data.deviceInfo || null,
    data.ipAddress || null,
    data.expiresAt,
  ])
  return result.rows[0]
}

const findByTokenHash = async (tokenHash: string): Promise<RefreshToken | null> => {
  const sql = `SELECT * FROM refresh_tokens WHERE token_hash = $1`
  const result = await query(sql, [tokenHash])
  return result.rows[0] || null
}

const revokeToken = async (id: number): Promise<void> => {
  const sql = `
    UPDATE refresh_tokens
    SET is_revoked = TRUE,
        revoked_at = NOW()
    WHERE id = $1
  `
  await query(sql, [id])
}

const revokeAllUserTokens = async (userId: number): Promise<void> => {
  const sql = `
    UPDATE refresh_tokens
    SET is_revoked = TRUE,
        revoked_at = NOW()
    WHERE user_id = $1 AND is_revoked = FALSE
  `
  await query(sql, [userId])
}

const deleteExpiredTokens = async (): Promise<number> => {
  const sql = `DELETE FROM refresh_tokens WHERE expires_at < NOW() RETURNING id`
  const result = await query(sql)
  return result.rowCount ?? 0
}

export const sessionRepository = {
  createRefreshToken,
  findByTokenHash,
  revokeToken,
  revokeAllUserTokens,
  deleteExpiredTokens,
}
