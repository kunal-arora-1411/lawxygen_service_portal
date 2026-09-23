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
  API_OPERATIONS.forgotPassword.endpoint,
  API_OPERATIONS.verifyResetOtp.endpoint,
  API_OPERATIONS.resetPassword.endpoint,
  API_OPERATIONS.adminLogin.endpoint,
  API_OPERATIONS.adminRefreshToken.endpoint,
  API_OPERATIONS.adminLogout.endpoint,
]);

const ADMIN_PATH_PREFIX = "/api/admin";

class ApiService {
  private client: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;
  private sessionExpiredHandled = false;

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
    // A batch of concurrent 401s all await the same shared refreshPromise,
    // so if it rejects, every one of them lands here in the same tick —
    // without this guard each would independently redirect/clear cookies.
    if (this.sessionExpiredHandled) return;
    this.sessionExpiredHandled = true;

    if (isAdmin) {
      // There is no unauthenticated /admin/login route in this app yet, and
      // every /admin page fires its own authenticated requests on mount —
      // redirecting to "/admin" here would just reload straight back into
      // another 401 -> refresh-fails -> redirect loop (this is what was
      // hammering the backend with hundreds of requests). Until a real
      // admin login page exists, leave the user on the current page; every
      // admin view already renders a "Not available" empty state when its
      // own fetch fails, so the UI still degrades gracefully.
      console.warn(
        "Admin session expired or invalid, and no admin login page exists yet — not redirecting to avoid a reload loop."
      );
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