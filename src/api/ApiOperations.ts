import { HttpType } from "@/constant/HttpMethods";

export const API_OPERATIONS = {
  // =========================
  // CLIENT AUTH
  // =========================

  emailAuth: {
    endpoint: "/api/client/auth/email",
    method: HttpType.POST,
  },

  sendPhoneOtp: {
    endpoint: "/api/client/auth/phone/send-otp",
    method: HttpType.POST,
  },

  verifyPhoneOtp: {
    endpoint: "/api/client/auth/phone/verify-otp",
    method: HttpType.POST,
  },

  refreshToken: {
    endpoint: "/api/client/auth/refresh-token",
    method: HttpType.POST,
  },

  logout: {
    endpoint: "/api/client/auth/logout",
    method: HttpType.POST,
  },

  getCurrentUser: {
    endpoint: "/api/client/auth/me",
    method: HttpType.GET,
  },
} as const;

export const getApiOperation = (
  operationName: keyof typeof API_OPERATIONS
) => {
  const operation = API_OPERATIONS[operationName];

  if (!operation) {
    throw new Error(
      `Unknown API operation: ${operationName}`
    );
  }

  return operation;
};