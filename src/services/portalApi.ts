import apiService from "@/api/ApiService";
import { HttpType } from "@/constant/HttpMethods";

// =========================
// CLIENT PROFILE
// =========================

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export async function updateCurrentUser(payload: UpdateProfilePayload) {
  const response = await apiService.call("updateCurrentUser", payload);
  return response.data;
}

export async function updateCurrentUserPassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await apiService.call("updateCurrentUserPassword", payload);
  return response.data;
}

export async function deleteCurrentUser() {
  const response = await apiService.call("deleteCurrentUser");
  return response.data;
}

// =========================
// APPOINTMENTS
// =========================

export interface AppointmentRecord {
  _id: string;
  client: string;
  serviceMatter: string | null;
  professional: { _id: string; name: string } | null;
  scheduledAt: string;
  durationMinutes: number;
  mode: "video" | "phone" | "in_person";
  topic: string;
  status: "requested" | "confirmed" | "completed" | "missed" | "cancelled";
  joinUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentStats {
  upcoming: number;
  video: number;
  completed: number;
  missed: number;
}

export async function getAppointmentStats(): Promise<AppointmentStats> {
  const response = await apiService.call<AppointmentStats>("getAppointmentStats");
  return response.data;
}

export async function getAppointments(params?: {
  status?: AppointmentRecord["status"];
  upcoming?: boolean;
}): Promise<AppointmentRecord[]> {
  const response = await apiService.call<AppointmentRecord[]>("getAppointments", params);
  return response.data;
}

export async function createAppointment(payload: {
  serviceMatter?: string;
  scheduledAt: string;
  durationMinutes: number;
  mode: AppointmentRecord["mode"];
  topic: string;
}): Promise<AppointmentRecord> {
  const response = await apiService.call<AppointmentRecord>("createAppointment", payload);
  return response.data;
}

export async function updateAppointment(
  appointmentId: string,
  payload: { scheduledAt: string } | { status: "cancelled" }
): Promise<AppointmentRecord> {
  const response = await apiService.request<AppointmentRecord>(
    HttpType.PATCH,
    `/api/client/appointments/${encodeURIComponent(appointmentId)}`,
    payload
  );
  return response.data;
}

// =========================
// DOCUMENTS
// =========================

export interface DocumentRecord {
  _id: string;
  client: string;
  serviceMatter: { _id: string; title: string } | null;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  status: "uploaded" | "in_review" | "verified" | "rejected";
  reviewNote: string | null;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface DocumentStats {
  total: number;
  verified: number;
  inReview: number;
  actionNeeded: number;
}

export async function getDocumentStats(): Promise<DocumentStats> {
  const response = await apiService.call<DocumentStats>("getDocumentStats");
  return response.data;
}

export async function getDocuments(params?: {
  status?: DocumentRecord["status"];
  serviceMatter?: string;
}): Promise<DocumentRecord[]> {
  const response = await apiService.call<DocumentRecord[]>("getDocuments", params);
  return response.data;
}

export async function uploadDocument(
  file: File,
  serviceMatterId?: string
): Promise<DocumentRecord> {
  const form = new FormData();
  form.append("file", file);
  if (serviceMatterId) form.append("serviceMatter", serviceMatterId);

  const response = await apiService.request<DocumentRecord>(
    HttpType.POST,
    "/api/client/documents",
    form
  );
  return response.data;
}

export async function deleteDocument(documentId: string): Promise<void> {
  await apiService.request(
    HttpType.DELETE,
    `/api/client/documents/${encodeURIComponent(documentId)}`
  );
}

// =========================
// COMPLIANCE
// =========================

export interface ComplianceItem {
  _id: string;
  client: string;
  serviceMatter: { _id: string; title: string } | null;
  title: string;
  description: string;
  dueAt: string;
  status: "upcoming" | "due_soon" | "completed" | "overdue";
  completedAt: string | null;
  createdAt: string;
}

export interface ComplianceStats {
  upcoming: number;
  dueSoon: number;
  completed: number;
  overdue: number;
}

export async function getComplianceStats(): Promise<ComplianceStats> {
  const response = await apiService.call<ComplianceStats>("getComplianceStats");
  return response.data;
}

export async function getCompliance(params?: {
  status?: ComplianceItem["status"];
}): Promise<ComplianceItem[]> {
  const response = await apiService.call<ComplianceItem[]>("getCompliance", params);
  return response.data;
}

// =========================
// CONVERSATIONS / MESSAGES
// =========================

export interface Conversation {
  _id: string;
  client: string;
  participants: { _id: string; name: string; role: string }[];
  subject: string;
  lastMessage: { body: string; senderId: string; sentAt: string } | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: { _id: string; name: string; role: string };
  body: string;
  attachments: string[];
  sentAt: string;
}

export interface ConversationStats {
  unread: number;
  conversations: number;
  experts: number;
  updatedToday: number;
}

export async function getConversationStats(): Promise<ConversationStats> {
  const response = await apiService.call<ConversationStats>("getConversationStats");
  return response.data;
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiService.call<Conversation[]>("getConversations");
  return response.data;
}

export async function getConversationMessages(
  conversationId: string,
  params?: { before?: string; limit?: number }
): Promise<Message[]> {
  const response = await apiService.request<Message[]>(
    HttpType.GET,
    `/api/client/conversations/${encodeURIComponent(conversationId)}/messages`,
    params
  );
  return response.data;
}

export async function sendMessage(
  conversationId: string,
  payload: { body: string; attachments?: string[] }
): Promise<Message> {
  const response = await apiService.request<Message>(
    HttpType.POST,
    `/api/client/conversations/${encodeURIComponent(conversationId)}/messages`,
    payload
  );
  return response.data;
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await apiService.request(
    HttpType.POST,
    `/api/client/conversations/${encodeURIComponent(conversationId)}/read`
  );
}

// =========================
// SUPPORT TICKETS
// =========================

export interface SupportTicket {
  _id: string;
  client: string;
  serviceMatter: { _id: string; title: string } | null;
  subject: string;
  language: string | null;
  status: "waiting" | "in_progress" | "resolved";
  waitStartedAt: string;
  resolvedAt: string | null;
  createdAt: string;
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const response = await apiService.call<SupportTicket[]>("getSupportTickets");
  return response.data;
}

export async function createSupportTicket(payload: {
  subject: string;
  serviceMatter?: string;
  language?: string;
}): Promise<SupportTicket> {
  const response = await apiService.call<SupportTicket>("createSupportTicket", payload);
  return response.data;
}

// =========================
// DASHBOARD
// =========================

export interface ClientDashboardStats {
  activeServices: number;
  servicesNeedingAction: number;
  upcomingCompliance: number;
  nextComplianceDueInDays: number | null;
  appointmentsBooked: number;
  nextAppointmentAt: string | null;
  documentsCount: number;
  documentsUploadedThisWeek: number;
}

export interface DashboardActivityItem {
  type: "service_matter" | "appointment" | "document";
  title: string;
  description: string;
  occurredAt: string;
}

export async function getClientDashboardStats(): Promise<ClientDashboardStats> {
  const response = await apiService.call<ClientDashboardStats>("getClientDashboardStats");
  return response.data;
}

export async function getClientDashboardActivity(): Promise<DashboardActivityItem[]> {
  const response = await apiService.call<DashboardActivityItem[]>("getClientDashboardActivity");
  return response.data;
}
