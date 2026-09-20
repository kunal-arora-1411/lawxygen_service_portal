import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
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

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
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