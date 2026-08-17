export interface UserProfile {
  id?: number;
  email: string;
  role?: string;
  created_at?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  user?: {
    user?: UserProfile;
    email?: string;
    role?: string;
    token?: string;
  } | UserProfile;
  token?: string;
}

export interface LoginResult {
  user: UserProfile;
  token: string;
}
