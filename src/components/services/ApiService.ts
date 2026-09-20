import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { HttpType } from "../domain/constants/HttpMethods";
import { getSessionStorage } from "../data/helpers/storage.helper";
import { tokenService } from "./TokenService.ts";
import { route } from "../domain/constants/routes";
import { getApiOperation } from "./ApiOperations";
import { STORAGE_KEY } from "../domain/constants/storage.constant.ts";
import { injectDevAuthHeaders, isDevAuthBypass } from "./devAuth";
import { isShopifyEmbedded } from "../shopify/runtime";

// Strip any trailing slash on the base URL so the `${apiBaseUrl}${endpoint}`
// concat below never produces `/api//orders/...` if a future env file
// adds a trailing slash by mistake.
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);

// Standard API Response Types
interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    [key: string]: any;
  };
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    errorId?: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    [key: string]: any;
  };
}

type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

class ApiService {
  private maxRetries = 3;

  // Main API method
  async call<T = any>(
    operationName: string,
    params: Record<string, any> = {},
    config?: AxiosRequestConfig,
  ): Promise<ApiSuccessResponse<T>> {
    try {
      const operation = getApiOperation(operationName);

      // Process URL parameters and build endpoint
      const { processedEndpoint, bodyParams } = this.processEndpointParams(
        operation.endpoint,
        params,
      );

      // Make the API call with custom base URL if provided
      const response = await this.makeRequest({
        method: operation.method,
        endpoint: processedEndpoint,
        params: bodyParams,
        config,
        baseUrl: operation.baseUrl, // Use custom base URL from operation config
      });

      // Handle response
      return this.handleResponse<T>(response);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Direct REST call method for custom endpoints not in operations map
  async request<T = any>(
    method: string,
    endpoint: string,
    params: Record<string, any> = {},
    config?: AxiosRequestConfig,
  ): Promise<ApiSuccessResponse<T>> {
    try {
      const response = await this.makeRequest({
        method,
        endpoint,
        params,
        config,
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // FormData upload method for file uploads
  async uploadFormData<T = any>(
    operationName: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<ApiSuccessResponse<T>> {
    try {
      const operation = getApiOperation(operationName);

      // Make the API call with FormData
      const response = await this.makeFormDataRequest({
        method: operation.method,
        endpoint: operation.endpoint,
        formData,
        config,
      });

      return this.handleResponse<T>(response);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // External API call method for third-party APIs with full URLs
  async externalRequest<T = any>(
    method: string,
    fullUrl: string,
    params: Record<string, any> = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          "Content-Type": "application/json",
          ...config?.headers,
        },
      };

      let response;

      switch (method) {
        case HttpType.GET:
          response = await axios.get(fullUrl, { ...requestConfig, params });
          break;
        case HttpType.POST:
          response = await axios.post(fullUrl, params, requestConfig);
          break;
        case HttpType.PATCH:
          response = await axios.patch(fullUrl, params, requestConfig);
          break;
        case HttpType.PUT:
          response = await axios.put(fullUrl, params, requestConfig);
          break;
        case HttpType.DELETE:
          response = await axios.delete(fullUrl, {
            ...requestConfig,
            data: params,
          });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "External API error";
      const apiError = new Error(errorMessage);
      (apiError as any).response = error?.response;
      (apiError as any).status = error?.response?.status;
      throw apiError;
    }
  }

  // Process URL parameters and separate them from body parameters
  private processEndpointParams(endpoint: string, params: Record<string, any>) {
    let processedEndpoint = endpoint;
    const bodyParams = { ...params };

    // Handle URL parameter replacements
    const urlParamMap = {
      ":id": [
        "id",
        "user_id",
        "pixelphant_user_id",
        "member_id",
        "organization_id",
        "order_id",
        "node_id",
        "markup_id",
      ],
      ":org_id": ["org_id", "organization_id"],
      ":member_id": ["member_id", "member_user_id"],
      ":order_id": ["order_id"],
      ":user_id": ["user_id", "id"],
      ":node_id": ["node_id"],
      ":authorizationCode": ["authorizationCode"],
      ":role_id": ["role_id"],
      ":guide_id": ["guide_id"],
      ":preset_id": ["preset_id"],
      ":scope_id": ["scope_id"],
      ":add_on_id": ["add_on_id"],
      ":position_id": ["position_id"],
      ":retouching_package_id": ["retouching_package_id"],
      ":photo_position_id": ["photo_position_id"],
      ":tech_spec_id": ["tech_spec_id"],
      ":link_id": ["link_id"],
      ":instruction_document_id": ["instruction_document_id"],
      ":feedback_loop_id": ["feedback_loop_id"],
      ":section_id": ["section_id"],
      ":version_id": ["version_id"],
      ":format_catalog_id": ["format_catalog_id"],
      ":sub_option_id": ["sub_option_id"],
      ":comment_id": ["comment_id"],
      ":template_id": ["template_id"],
      ":annotation_id": ["annotation_id"],
      ":single_process_id": ["single_process_id"],
      ":batch_session_id": ["batch_session_id"],
      ":additional_file_id": ["additional_file_id"],
      ":proposal_id": ["proposal_id"],
    };

    // Replace URL parameters
    for (const [placeholder, paramKeys] of Object.entries(urlParamMap)) {
      if (processedEndpoint.includes(placeholder)) {
        const value = paramKeys.find((key) => params[key] !== undefined);
        if (value && params[value]) {
          processedEndpoint = processedEndpoint.replace(
            placeholder,
            params[value],
          );
          // Remove URL param from body params
          paramKeys.forEach((key) => delete bodyParams[key]);
        }
      }
    }

    return { processedEndpoint, bodyParams };
  }

  // Make FormData request with authentication
  private async makeFormDataRequest({
    method,
    endpoint,
    formData,
    config,
  }: {
    method: string;
    endpoint: string;
    formData: FormData;
    config?: AxiosRequestConfig;
  }): Promise<AxiosResponse> {
    // Get authentication headers
    const headers = await this.getAuthHeaders();

    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...headers,
        // Don't set Content-Type, let axios set it for FormData
        ...config?.headers,
      },
    };

    const url = `${apiBaseUrl}${endpoint}`;

    switch (method) {
      case HttpType.POST:
        return axios.post(url, formData, requestConfig);
      case HttpType.PATCH:
        return axios.patch(url, formData, requestConfig);
      case HttpType.PUT:
        return axios.put(url, formData, requestConfig);
      default:
        throw new Error(`Unsupported HTTP method for FormData: ${method}`);
    }
  }

  // Make HTTP request with authentication and retry logic
  private async makeRequest({
    method,
    endpoint,
    params,
    config,
    baseUrl,
  }: {
    method: string;
    endpoint: string;
    params: Record<string, any>;
    config?: AxiosRequestConfig;
    baseUrl?: string;
  }): Promise<AxiosResponse> {
    let retryCount = 0;

    const executeRequest = async (): Promise<AxiosResponse> => {
      // Get authentication headers
      const headers = await this.getAuthHeaders();

      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...headers,
          ...config?.headers,
        },
      };

      // Use custom base URL if provided, otherwise use default
      const url = `${baseUrl || apiBaseUrl}${endpoint}`;

      switch (method) {
        case HttpType.GET:
          return axios.get(url, { ...requestConfig, params });
        case HttpType.POST:
          return axios.post(url, params, requestConfig);
        case HttpType.PATCH:
          return axios.patch(url, params, requestConfig);
        case HttpType.PUT:
          return axios.put(url, params, requestConfig);
        case HttpType.DELETE:
          return axios.delete(url, { ...requestConfig, data: params });
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    };

    while (retryCount <= this.maxRetries) {
      try {
        return await executeRequest();
      } catch (error: any) {
        // Handle 401 errors with automatic token refresh and retry
        if (error?.response?.status === 401 && retryCount < this.maxRetries) {
          retryCount++;
          // Reset auth failure state and get fresh token
          tokenService.resetAuthFailureState();
          const newToken = await tokenService.getValidToken();
          console.log("🚀 ~ ApiService ~ makeRequest ~ newToken:", newToken);

          if (!newToken) {
            // TokenService returned null - session expired or refresh failed
            console.log("⛔ No valid token available - stopping retries");
            throw error;
          }

          // Continue to next retry
          continue;
        }

        throw error;
      }
    }

    throw new Error("Max retries exceeded");
  }

  // Get authentication headers
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    if (isDevAuthBypass()) {
      // Local dev: skip Cognito, send X-Dev-Auth-Email so backend resolves identity
      injectDevAuthHeaders(headers);
    } else {
      // Always try to get a valid token if user is authenticated
      const isAuth = await tokenService.isAuthenticated();
      if (isAuth) {
        const idToken = await tokenService.getValidToken();
        if (!idToken) {
          this.handleAuthenticationError();
          throw new Error("No valid token available");
        }
        headers.Authorization = `Bearer ${idToken}`;
      }
    }

    // Add organization header
    const organizationId = getSessionStorage(STORAGE_KEY.organizationId);
    if (organizationId) {
      headers["x-org"] = organizationId;
    }
    return headers;
  }

  // Handle successful response
  private handleResponse<T>(response: AxiosResponse): ApiSuccessResponse<T> {
    const responseData = response.data;

    // Check if response has error structure
    if (responseData?.error) {
      throw new Error(responseData.error.message || "API Error");
    }

    // Return standardized success response
    return responseData as ApiSuccessResponse<T>;
  }

  // Handle API errors
  private handleError(error: any): Error {
    // Handle authentication errors
    if (
      error?.response?.data?.message === "Access denied" ||
      error?.response?.status === 401
    ) {
      this.handleAuthenticationError();
    }

    // Extract error information
    const errorData =
      error?.response?.data?.error || error?.response?.data || error;
    const errorMessage =
      errorData?.message || error?.message || "An error occurred";

    // Create structured error
    const apiError = new Error(errorMessage);
    (apiError as any).code =
      errorData?.code || error?.response?.status || "UNKNOWN_ERROR";
    (apiError as any).details = errorData?.details || null;
    (apiError as any).data = errorData?.data || null;
    (apiError as any).response = error?.response;

    return apiError;
  }

  // Handle authentication errors
  private handleAuthenticationError(): void {
    if (isShopifyEmbedded()) return;
    Cookies.remove("userEmail");
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = route.LOGIN;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

// Type exports for better TypeScript support
export type { ApiSuccessResponse, ApiErrorResponse, ApiResponse };
