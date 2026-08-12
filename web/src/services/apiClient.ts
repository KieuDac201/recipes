import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Standard API Error class
 */
export class ApiError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Base Axios Client Instance
 */
const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==========================================
// Request Interceptors
// ==========================================
httpClient.interceptors.request.use(
  (config) => {
    // If auth token is present in localStorage / cookies, attach it here
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptors
// ==========================================
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string; details?: any }>) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage =
        data?.error || data?.message || error.message || "An unexpected server error occurred.";
      return Promise.reject(new ApiError(errorMessage, status, data?.details));
    } else if (error.request) {
      return Promise.reject(
        new ApiError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.", 0)
      );
    } else {
      return Promise.reject(new ApiError(error.message || "Lỗi khởi tạo yêu cầu."));
    }
  }
);

/**
 * Universal API Client Wrapper
 */
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.get<T>(url, config);
    return response.data;
  },

  post: async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await httpClient.delete<T>(url, config);
    return response.data;
  },

  raw: httpClient,
};

export default apiClient;
