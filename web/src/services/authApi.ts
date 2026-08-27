import { apiClient, ApiError } from "./apiClient";
import {
  LoginPayload,
  RegisterPayload,
  UserProfile,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
} from "@/src/types/auth";
export type {
  LoginPayload,
  RegisterPayload,
  UserProfile,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MessageResponse,
};

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export interface AuthSuccessResponse {
  message: string;
  user: {
    user: UserProfile;
    token: string;
  };
}

export interface RegisterSuccessResponse {
  message: string;
  user: UserProfile;
}

export const authService = {
  /**
   * Log in user with email and password
   */
  login: async (payload: LoginPayload): Promise<{ user: UserProfile; token: string }> => {
    try {
      const response = await apiClient.post<AuthSuccessResponse>("/users/login", payload);
      const token = response.user?.token;
      const user = response.user?.user || { email: payload.email };

      if (token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }

      return { user, token };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  },

  /**
   * Log in or Sign up with Google OAuth2 ID Token
   */
  googleLogin: async (idToken: string): Promise<{ user: UserProfile; token: string }> => {
    try {
      const response = await apiClient.post<AuthSuccessResponse>("/users/oauth/google", { idToken });
      const token = response.user?.token;
      const user = response.user?.user || { email: "" };

      if (token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }

      return { user, token };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  },

  /**
   * Register a new user account
   */
  register: async (payload: RegisterPayload): Promise<UserProfile> => {
    try {
      const response = await apiClient.post<RegisterSuccessResponse>("/users", payload);
      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Đăng ký tài khoản thất bại. Vui lòng thử lại.");
    }
  },

  /**
   * Request OTP for password reset
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<MessageResponse> => {
    try {
      const response = await apiClient.post<MessageResponse>("/users/forgot-password", payload);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Không thể gửi mã OTP. Vui lòng kiểm tra lại email.");
    }
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<MessageResponse> => {
    try {
      const response = await apiClient.post<MessageResponse>("/users/reset-password", payload);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP.");
    }
  },

  /**
   * Verify email with magic link token
   */
  verifyEmail: async (token: string): Promise<{ user: UserProfile; token: string }> => {
    try {
      const response = await apiClient.post<any>("/users/verify-email", { token });
      const sessionToken = response.token || response.user?.token;
      const user = response.user?.user || response.user || {};

      if (typeof window !== "undefined") {
        if (sessionToken) {
          localStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
        }
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }

      return { user, token: sessionToken };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Xác thực email thất bại hoặc liên kết đã hết hạn.");
    }
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string): Promise<MessageResponse> => {
    try {
      const response = await apiClient.post<MessageResponse>("/users/resend-verification", {
        email,
      });
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Không thể gửi lại email xác thực. Vui lòng thử lại.");
    }
  },

  /**
   * Log out current user
   */
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },

  /**
   * Get current stored session token and user info
   */
  getCurrentUser: (): UserProfile | null => {
    if (typeof window === "undefined") return null;
    try {
      const userJson = localStorage.getItem(AUTH_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(AUTH_USER_KEY) || !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};

export const login = authService.login;
export const register = authService.register;
export const forgotPassword = authService.forgotPassword;
export const resetPassword = authService.resetPassword;
export const logout = authService.logout;
export const getCurrentUser = authService.getCurrentUser;
export const isAuthenticated = authService.isAuthenticated;

export default authService;
