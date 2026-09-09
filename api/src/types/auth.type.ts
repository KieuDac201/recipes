export interface RefreshToken {
  id: number
  user_id: number
  token_hash: string
  device_info: string | null
  ip_address: string | null
  expires_at: Date | string
  is_revoked: boolean
  created_at: Date | string
  revoked_at: Date | string | null
}

export interface AccessTokenPayload {
  id: number
  email: string
  role: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult {
  user: {
    id: number
    email: string
    role: string
    avatar_url?: string | null
    auth_provider?: string
  }
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenPayload {
  refreshToken?: string
}
