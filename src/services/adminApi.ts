import apiService from "@/api/ApiService";
import { HttpType } from "@/constant/HttpMethods";
import type { ServiceRecord, ServiceMatterRecord } from "./serviceApi";
import type {
  AppointmentRecord,
  AppointmentStats,
  DocumentRecord,
  ComplianceItem,
  Conversation,
  Message,
  SupportTicket,
} from "./portalApi";

// =========================
// ADMIN AUTH
// =========================

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  createdAt: string;
}

export async function adminLogin(payload: {
  email: string;
  password: string;
}): Promise<AdminUser> {
  const response = await apiService.call<{ admin: AdminUser }>("adminLogin", payload);
  return (response.data as any)?.admin ?? (response.data as any);
}

export async function adminLogout(): Promise<void> {
  await apiService.call("adminLogout");
}

export async function getCurrentAdmin(): Promise<AdminUser> {
  const response = await apiService.call<{ admin: AdminUser }>("getCurrentAdmin");
  return (response.data as any)?.admin ?? (response.data as any);
}

// =========================
// SERVICE REQUESTS (service matters)
// =========================

export interface AdminServiceMatterStats {
  active: number;
  unassigned: number;
  dueToday: number;
  withinSlaPercent: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export async function getAdminServiceMatterStats(): Promise<AdminServiceMatterStats> {
  const response = await apiService.call<AdminServiceMatterStats>("getAdminServiceMatterStats");
  return response.data;
}

export async function getAdminServiceMatters(params?: {
  status?: string;
  unassigned?: boolean;
  page?: number;
  limit?: number;
}): Promise<PagedResult<ServiceMatterRecord>> {
  const response = await apiService.call<PagedResult<ServiceMatterRecord>>(
    "getAdminServiceMatters",
    params
  );
  return response.data;
}

export async function getAdminServiceMatterById(
  matterId: string
): Promise<ServiceMatterRecord> {
  const response = await apiService.request<ServiceMatterRecord>(
    HttpType.GET,
    `/api/admin/service-matters/${encodeURIComponent(matterId)}`
  );
  return response.data;
}

export async function updateAdminServiceMatter(
  matterId: string,
  payload: {
    status?: string;
    professional?: string | null;
    actionRequired?: boolean;
    actionMessage?: string;
  }
): Promise<ServiceMatterRecord> {
  const response = await apiService.request<ServiceMatterRecord>(
    HttpType.PATCH,
    `/api/admin/service-matters/${encodeURIComponent(matterId)}`,
    payload
  );
  return response.data;
}

// =========================
// APPOINTMENTS
// =========================

export async function getAdminAppointmentStats(): Promise<{
  today: number;
  upcoming: number;
  pending: number;
  professionalsAvailable: number;
}> {
  const response = await apiService.call<{
    today: number;
    upcoming: number;
    pending: number;
    professionalsAvailable: number;
  }>("getAdminAppointmentStats");
  return response.data;
}

export async function getAdminAppointments(params?: {
  status?: string;
  date?: string;
  page?: number;
  limit?: number;
}): Promise<PagedResult<AppointmentRecord>> {
  const response = await apiService.call<PagedResult<AppointmentRecord>>(
    "getAdminAppointments",
    params
  );
  return response.data;
}

export async function updateAdminAppointment(
  appointmentId: string,
  payload: {
    status?: AppointmentRecord["status"];
    professional?: string | null;
    scheduledAt?: string;
  }
): Promise<AppointmentRecord> {
  const response = await apiService.request<AppointmentRecord>(
    HttpType.PATCH,
    `/api/admin/appointments/${encodeURIComponent(appointmentId)}`,
    payload
  );
  return response.data;
}

// =========================
// DOCUMENTS
// =========================

export async function getAdminDocuments(params?: {
  status?: DocumentRecord["status"];
  client?: string;
  page?: number;
  limit?: number;
}): Promise<PagedResult<DocumentRecord & { client: { name: string; email: string } }>> {
  const response = await apiService.call<
    PagedResult<DocumentRecord & { client: { name: string; email: string } }>
  >("getAdminDocuments", params);
  return response.data;
}

export async function updateAdminDocument(
  documentId: string,
  payload: { status: DocumentRecord["status"]; reviewNote?: string }
): Promise<DocumentRecord> {
  const response = await apiService.request<DocumentRecord>(
    HttpType.PATCH,
    `/api/admin/documents/${encodeURIComponent(documentId)}`,
    payload
  );
  return response.data;
}

// =========================
// COMPLIANCE
// =========================

export async function getAdminCompliance(params?: {
  client?: string;
  status?: ComplianceItem["status"];
  page?: number;
  limit?: number;
}): Promise<PagedResult<ComplianceItem>> {
  const response = await apiService.call<PagedResult<ComplianceItem>>(
    "getAdminCompliance",
    params
  );
  return response.data;
}

export async function createAdminCompliance(payload: {
  client: string;
  serviceMatter?: string;
  title: string;
  description: string;
  dueAt: string;
}): Promise<ComplianceItem> {
  const response = await apiService.call<ComplianceItem>("createAdminCompliance", payload);
  return response.data;
}

export async function updateAdminCompliance(
  complianceId: string,
  payload: { status?: ComplianceItem["status"]; dueAt?: string }
): Promise<ComplianceItem> {
  const response = await apiService.request<ComplianceItem>(
    HttpType.PATCH,
    `/api/admin/compliance/${encodeURIComponent(complianceId)}`,
    payload
  );
  return response.data;
}

// =========================
// CONVERSATIONS
// =========================

export async function getAdminConversations(params?: {
  unread?: boolean;
  page?: number;
  limit?: number;
}): Promise<PagedResult<Conversation>> {
  const response = await apiService.call<PagedResult<Conversation>>(
    "getAdminConversations",
    params
  );
  return response.data;
}

export async function sendAdminMessage(
  conversationId: string,
  payload: { body: string; attachments?: string[] }
): Promise<Message> {
  const response = await apiService.request<Message>(
    HttpType.POST,
    `/api/admin/conversations/${encodeURIComponent(conversationId)}/messages`,
    payload
  );
  return response.data;
}

// =========================
// SUPPORT TICKETS
// =========================

export async function getAdminSupportStats(): Promise<{
  waiting: number;
  inProgress: number;
  resolvedToday: number;
  avgResponseMinutes: number;
}> {
  const response = await apiService.call<{
    waiting: number;
    inProgress: number;
    resolvedToday: number;
    avgResponseMinutes: number;
  }>("getAdminSupportStats");
  return response.data;
}

export async function getAdminSupportTickets(params?: {
  status?: SupportTicket["status"];
  page?: number;
  limit?: number;
}): Promise<PagedResult<SupportTicket>> {
  const response = await apiService.call<PagedResult<SupportTicket>>(
    "getAdminSupportTickets",
    params
  );
  return response.data;
}

export async function updateAdminSupportTicket(
  ticketId: string,
  payload: { status: SupportTicket["status"] }
): Promise<SupportTicket> {
  const response = await apiService.request<SupportTicket>(
    HttpType.PATCH,
    `/api/admin/support/tickets/${encodeURIComponent(ticketId)}`,
    payload
  );
  return response.data;
}

// =========================
// USERS (client directory)
// =========================

export interface AdminUserListItem {
  _id: string;
  name: string;
  location: string | null;
  activeMattersCount: number;
  joinedAt: string;
  status: "active" | "inactive";
  verified: boolean;
}

export async function getAdminUserStats(): Promise<{
  registered: number;
  newThisMonth: number;
  activeMatters: number;
  verifiedPercent: number;
}> {
  const response = await apiService.call<{
    registered: number;
    newThisMonth: number;
    activeMatters: number;
    verifiedPercent: number;
  }>("getAdminUserStats");
  return response.data;
}

export async function getAdminUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PagedResult<AdminUserListItem>> {
  const response = await apiService.call<PagedResult<AdminUserListItem>>(
    "getAdminUsers",
    params
  );
  return response.data;
}

export async function getAdminUserById(
  userId: string
): Promise<AdminUserListItem & { matters: ServiceMatterRecord[]; matterCount: number }> {
  const response = await apiService.request<
    AdminUserListItem & { matters: ServiceMatterRecord[]; matterCount: number }
  >(HttpType.GET, `/api/admin/users/${encodeURIComponent(userId)}`);
  return response.data;
}

// =========================
// PROFESSIONALS
// =========================

export interface Professional {
  _id: string;
  name: string;
  role: string;
  specialties: string[];
  languages: string[];
  availability: "online" | "in_call" | "offline";
  activeMattersCount: number;
  createdAt: string;
}

export async function getAdminProfessionalStats(): Promise<{
  total: number;
  online: number;
  inCall: number;
  offline: number;
}> {
  const response = await apiService.call<{
    total: number;
    online: number;
    inCall: number;
    offline: number;
  }>("getAdminProfessionalStats");
  return response.data;
}

export async function getAdminProfessionals(params?: {
  availability?: Professional["availability"];
  page?: number;
  limit?: number;
}): Promise<PagedResult<Professional>> {
  const response = await apiService.call<PagedResult<Professional>>(
    "getAdminProfessionals",
    params
  );
  return response.data;
}

export async function createAdminProfessional(payload: {
  name: string;
  role: string;
  specialties: string[];
  languages: string[];
  email?: string;
  phone?: string;
}): Promise<Professional> {
  const response = await apiService.call<Professional>("createAdminProfessional", payload);
  return response.data;
}

export async function updateAdminProfessional(
  professionalId: string,
  payload: {
    availability?: Professional["availability"];
    specialties?: string[];
    languages?: string[];
    role?: string;
  }
): Promise<Professional> {
  const response = await apiService.request<Professional>(
    HttpType.PATCH,
    `/api/admin/professionals/${encodeURIComponent(professionalId)}`,
    payload
  );
  return response.data;
}

// =========================
// SERVICE CATALOGUE
// =========================

export async function getAdminServiceStats(): Promise<{
  totalPages: number;
  categories: number;
  published: number;
  brokenLinks: number;
}> {
  const response = await apiService.call<{
    totalPages: number;
    categories: number;
    published: number;
    brokenLinks: number;
  }>("getAdminServiceStats");
  return response.data;
}

export async function getAdminServices(params?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<PagedResult<ServiceRecord>> {
  const response = await apiService.call<PagedResult<ServiceRecord>>(
    "getAdminServices",
    params
  );
  return response.data;
}

export async function createAdminService(
  payload: Omit<ServiceRecord, "_id">
): Promise<ServiceRecord> {
  const response = await apiService.call<ServiceRecord>("createAdminService", payload);
  return response.data;
}

export async function updateAdminService(
  serviceId: string,
  payload: Partial<Omit<ServiceRecord, "_id">>
): Promise<ServiceRecord> {
  const response = await apiService.request<ServiceRecord>(
    HttpType.PATCH,
    `/api/admin/services/${encodeURIComponent(serviceId)}`,
    payload
  );
  return response.data;
}

export async function publishAdminService(
  serviceId: string,
  isActive: boolean
): Promise<ServiceRecord> {
  const response = await apiService.request<ServiceRecord>(
    HttpType.PATCH,
    `/api/admin/services/${encodeURIComponent(serviceId)}/publish`,
    { isActive }
  );
  return response.data;
}

// =========================
// DASHBOARD
// =========================

export interface AdminDashboardStats {
  registeredClients: number;
  newClientsThisWeek: number;
  activeRequests: number;
  unassignedRequests: number;
  appointmentsToday: number;
  upcomingAppointments: number;
  publishedServices: number;
  serviceCategories: number;
}

export interface AdminActivityItem {
  type: "service_matter" | "appointment" | "support_ticket" | "document";
  title: string;
  description: string;
  occurredAt: string;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const response = await apiService.call<AdminDashboardStats>("getAdminDashboardStats");
  return response.data;
}

export async function getAdminWeeklyWorkload(): Promise<{ day: string; value: number }[]> {
  const response = await apiService.call<{ day: string; value: number }[]>(
    "getAdminWeeklyWorkload"
  );
  return response.data;
}

export async function getAdminNeedsAttention(): Promise<
  { title: string; description: string; dueAt: string }[]
> {
  const response = await apiService.call<
    { title: string; description: string; dueAt: string }[]
  >("getAdminNeedsAttention");
  return response.data;
}

export async function getAdminActivity(): Promise<AdminActivityItem[]> {
  const response = await apiService.call<AdminActivityItem[]>("getAdminActivity");
  return response.data;
}
