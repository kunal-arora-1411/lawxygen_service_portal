import { HttpType } from "@/constant/HttpMethods";

export const API_OPERATIONS = {
  // =========================
  // CLIENT AUTH
  // =========================

  googleAuth: {
    endpoint: "/api/client/auth/google",
    method: HttpType.POST,
  },

  facebookAuth: {
    endpoint: "/api/client/auth/facebook",
    method: HttpType.POST,
  },

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
    endpoint: "/api/client/users/me",
    method: HttpType.GET,
  },

  updateCurrentUser: {
    endpoint: "/api/client/users/me",
    method: HttpType.PATCH,
  },

  updateCurrentUserPassword: {
    endpoint: "/api/client/users/me/password",
    method: HttpType.PATCH,
  },

  deleteCurrentUser: {
    endpoint: "/api/client/users/me",
    method: HttpType.DELETE,
  },

  // =========================
  // CLIENT APPOINTMENTS
  // =========================

  getAppointmentStats: {
    endpoint: "/api/client/appointments/stats",
    method: HttpType.GET,
  },

  getAppointments: {
    endpoint: "/api/client/appointments",
    method: HttpType.GET,
  },

  createAppointment: {
    endpoint: "/api/client/appointments",
    method: HttpType.POST,
  },

  // =========================
  // CLIENT DOCUMENTS
  // =========================

  getDocumentStats: {
    endpoint: "/api/client/documents/stats",
    method: HttpType.GET,
  },

  getDocuments: {
    endpoint: "/api/client/documents",
    method: HttpType.GET,
  },

  uploadDocument: {
    endpoint: "/api/client/documents",
    method: HttpType.POST,
  },

  // =========================
  // CLIENT COMPLIANCE
  // =========================

  getComplianceStats: {
    endpoint: "/api/client/compliance/stats",
    method: HttpType.GET,
  },

  getCompliance: {
    endpoint: "/api/client/compliance",
    method: HttpType.GET,
  },

  // =========================
  // CLIENT CONVERSATIONS / MESSAGES
  // =========================

  getConversationStats: {
    endpoint: "/api/client/conversations/stats",
    method: HttpType.GET,
  },

  getConversations: {
    endpoint: "/api/client/conversations",
    method: HttpType.GET,
  },

  // =========================
  // CLIENT SUPPORT
  // =========================

  getSupportTickets: {
    endpoint: "/api/client/support/tickets",
    method: HttpType.GET,
  },

  createSupportTicket: {
    endpoint: "/api/client/support/tickets",
    method: HttpType.POST,
  },

  // =========================
  // CLIENT DASHBOARD
  // =========================

  getClientDashboardStats: {
    endpoint: "/api/client/dashboard/stats",
    method: HttpType.GET,
  },

  getClientDashboardActivity: {
    endpoint: "/api/client/dashboard/activity",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN AUTH
  // =========================

  adminLogin: {
    endpoint: "/api/admin/auth/login",
    method: HttpType.POST,
  },

  adminRefreshToken: {
    endpoint: "/api/admin/auth/refresh-token",
    method: HttpType.POST,
  },

  adminLogout: {
    endpoint: "/api/admin/auth/logout",
    method: HttpType.POST,
  },

  getCurrentAdmin: {
    endpoint: "/api/admin/me",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN SERVICE REQUESTS (service matters)
  // =========================

  getAdminServiceMatterStats: {
    endpoint: "/api/admin/service-matters/stats",
    method: HttpType.GET,
  },

  getAdminServiceMatters: {
    endpoint: "/api/admin/service-matters",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN APPOINTMENTS
  // =========================

  getAdminAppointmentStats: {
    endpoint: "/api/admin/appointments/stats",
    method: HttpType.GET,
  },

  getAdminAppointments: {
    endpoint: "/api/admin/appointments",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN DOCUMENTS
  // =========================

  getAdminDocuments: {
    endpoint: "/api/admin/documents",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN COMPLIANCE
  // =========================

  getAdminCompliance: {
    endpoint: "/api/admin/compliance",
    method: HttpType.GET,
  },

  createAdminCompliance: {
    endpoint: "/api/admin/compliance",
    method: HttpType.POST,
  },

  // =========================
  // ADMIN CONVERSATIONS
  // =========================

  getAdminConversations: {
    endpoint: "/api/admin/conversations",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN SUPPORT
  // =========================

  getAdminSupportStats: {
    endpoint: "/api/admin/support/stats",
    method: HttpType.GET,
  },

  getAdminSupportTickets: {
    endpoint: "/api/admin/support/tickets",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN USERS (client directory)
  // =========================

  getAdminUserStats: {
    endpoint: "/api/admin/users/stats",
    method: HttpType.GET,
  },

  getAdminUsers: {
    endpoint: "/api/admin/users/all",
    method: HttpType.GET,
  },

  // =========================
  // ADMIN PROFESSIONALS
  // =========================

  getAdminProfessionalStats: {
    endpoint: "/api/admin/professionals/stats",
    method: HttpType.GET,
  },

  getAdminProfessionals: {
    endpoint: "/api/admin/professionals",
    method: HttpType.GET,
  },

  createAdminProfessional: {
    endpoint: "/api/admin/professionals",
    method: HttpType.POST,
  },

  // =========================
  // ADMIN SERVICE CATALOGUE
  // =========================

  getAdminServiceStats: {
    endpoint: "/api/admin/services/stats",
    method: HttpType.GET,
  },

  getAdminServices: {
    endpoint: "/api/admin/services",
    method: HttpType.GET,
  },

  createAdminService: {
    endpoint: "/api/admin/services",
    method: HttpType.POST,
  },

  // =========================
  // ADMIN DASHBOARD
  // =========================

  getAdminDashboardStats: {
    endpoint: "/api/admin/dashboard/stats",
    method: HttpType.GET,
  },

  getAdminWeeklyWorkload: {
    endpoint: "/api/admin/dashboard/weekly-workload",
    method: HttpType.GET,
  },

  getAdminNeedsAttention: {
    endpoint: "/api/admin/dashboard/needs-attention",
    method: HttpType.GET,
  },

  getAdminActivity: {
    endpoint: "/api/admin/dashboard/activity",
    method: HttpType.GET,
  },

  // NOTE: routes with a path param (e.g. PATCH /api/client/appointments/:id,
  // GET /api/admin/users/:id, PATCH /api/admin/services/:id/publish, ...) are
  // NOT registered here — this registry only holds fixed-path operations.
  // Parameterised routes are called directly via `apiService.request()` from
  // the corresponding file in src/services/, the same way getServiceBySlug()
  // and getServicesByCategory() already do in src/services/serviceApi.ts.

} as const;

export const getApiOperation = (operationName: keyof typeof API_OPERATIONS) => {
  const operation = API_OPERATIONS[operationName];

  if (!operation) {
    throw new Error(`Unknown API operation: ${operationName}`);
  }

  return operation;
};
