import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";
import {
  API_OPERATIONS,
  getApiOperation,
} from "./ApiOperations";
import { HttpType } from "@/constant/HttpMethods";

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Requests to these endpoints must never trigger a refresh-and-retry cycle,
// otherwise a genuinely expired/invalid refresh token would recurse forever.
const AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH = new Set<string>([
  API_OPERATIONS.refreshToken.endpoint,
  API_OPERATIONS.googleAuth.endpoint,
  API_OPERATIONS.facebookAuth.endpoint,
  API_OPERATIONS.emailAuth.endpoint,
  API_OPERATIONS.sendPhoneOtp.endpoint,
  API_OPERATIONS.verifyPhoneOtp.endpoint,
  API_OPERATIONS.logout.endpoint,
  API_OPERATIONS.adminLogin.endpoint,
  API_OPERATIONS.adminRefreshToken.endpoint,
  API_OPERATIONS.adminLogout.endpoint,
]);

const ADMIN_PATH_PREFIX = "/api/admin";

class ApiService {
  private client: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error)
    );
  }

  private handleSessionExpired(isAdmin: boolean) {
    if (isAdmin) {
      // Admin sessions aren't tracked by a client-side marker cookie; just
      // send the visitor back to the admin login.
      if (typeof window !== "undefined") {
        window.location.href = "/admin";
      }
      return;
    }

    // The backend-issued auth cookies are gone/invalid; drop the client-side
    // marker cookie too and send the visitor back to log in again.
    Cookies.remove("userId");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  private async handleResponseError(error: any) {
    const originalRequest = error?.config as
      | RetryableRequestConfig
      | undefined;

    const isUnauthorized = error?.response?.status === 401;
    const isExemptEndpoint =
      !!originalRequest?.url &&
      AUTH_ENDPOINTS_EXEMPT_FROM_REFRESH.has(originalRequest.url);

    if (!isUnauthorized || !originalRequest || originalRequest._retry || isExemptEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const isAdminRequest = !!originalRequest.url?.startsWith(ADMIN_PATH_PREFIX);
    const refreshEndpoint = isAdminRequest
      ? API_OPERATIONS.adminRefreshToken.endpoint
      : API_OPERATIONS.refreshToken.endpoint;

    try {
      if (!this.refreshPromise) {
        this.refreshPromise = this.client
          .post(refreshEndpoint)
          .then(() => undefined)
          .finally(() => {
            this.refreshPromise = null;
          });
      }

      await this.refreshPromise;

      return this.client(originalRequest);
    } catch (refreshError) {
      this.handleSessionExpired(isAdminRequest);
      return Promise.reject(error);
    }
  }

  async call<T = any>(
    operationName: keyof typeof API_OPERATIONS,
    params: Record<string, any> = {},
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const operation = getApiOperation(operationName);

    const response = await this.request<T>(
      operation.method,
      operation.endpoint,
      params,
      config
    );

    return response;
  }

  async request<T = any>(
    method: string,
    endpoint: string,
    params: Record<string, any> = {},
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    let response: AxiosResponse<ApiResponse<T>>;

    switch (method) {
      case HttpType.GET:
        response = await this.client.get(endpoint, {
          ...config,
          params,
        });
        break;

      case HttpType.POST:
        response = await this.client.post(
          endpoint,
          params,
          config
        );
        break;

      case HttpType.PUT:
        response = await this.client.put(
          endpoint,
          params,
          config
        );
        break;

      case HttpType.PATCH:
        response = await this.client.patch(
          endpoint,
          params,
          config
        );
        break;

      case HttpType.DELETE:
        response = await this.client.delete(endpoint, {
          ...config,
          data: params,
        });
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  }
}

export const apiService = new ApiService();

export default apiService;