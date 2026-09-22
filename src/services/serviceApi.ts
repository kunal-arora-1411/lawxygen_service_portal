import axios from "axios";
import { apiService } from "@/api/ApiService";
import { HttpType } from "@/constant/HttpMethods";

export interface ServiceRecord {
  _id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  accent: string;
  variant: number;
  archetype: string;
  summary: string;
  highlights: string[];
  checklist: [string, string][];
  overview: string[];
  benefits: [string, string][];
  documents: [string, string][];
  process: [string, string][];
  faqs: [string, string][];
  related: { title: string; href: string }[];
  cta: string;
  note: string;
  bg: string;
  soft: string;
  price?: number | string;
  isActive?: boolean;
  [key: string]: unknown;
}

export async function getServices(): Promise<ServiceRecord[]> {
  const response = await apiService.request<ServiceRecord[]>(
    HttpType.GET,
    "/api/client/services"
  );
  return response.data;
}

export async function getServiceBySlug(
  slug: string
): Promise<ServiceRecord | null> {
  try {
    const response = await apiService.request<ServiceRecord>(
      HttpType.GET,
      `/api/client/services/slug/${encodeURIComponent(slug)}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getServicesByCategory(
  categorySlug: string
): Promise<ServiceRecord[]> {
  const response = await apiService.request<ServiceRecord[]>(
    HttpType.GET,
    `/api/client/services/category/${encodeURIComponent(categorySlug)}`
  );
  return response.data;
}

export async function assignService(serviceId: string): Promise<unknown> {
  const response = await apiService.request(
    HttpType.POST,
    "/api/client/serviceMatter",
    { serviceId }
  );
  return response.data;
}

export interface ServiceMatterRecord {
  _id: string;
  client: string;
  service: {
    _id: string;
    title: string;
    slug: string;
    category: string;
    categorySlug: string;
    accent: string;
    summary: string;
    price: number;
  } | null;
  serviceSnapshot: {
    title: string;
    slug: string;
    price: number;
  };
  professional: unknown;
  assignedBy: unknown;
  status: string;
  progress: number;
  currentStep: number;
  totalSteps: number;
  currentStepTitle: string;
  actionRequired: boolean;
  actionMessage: string;
  assignedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getServiceMatter(): Promise<ServiceMatterRecord[]> {
  const response = await apiService.request<ServiceMatterRecord[]>(
    HttpType.GET,
    "/api/client/serviceMatter",
  );
  return response.data;
}

export async function getServiceMatterById(
  matterId: string
): Promise<ServiceMatterRecord> {
  const response = await apiService.request<ServiceMatterRecord>(
    HttpType.GET,
    `/api/client/serviceMatter/${encodeURIComponent(matterId)}`
  );
  return response.data;
}

export async function resolveMatterAction(
  matterId: string
): Promise<ServiceMatterRecord> {
  const response = await apiService.request<ServiceMatterRecord>(
    HttpType.PATCH,
    `/api/client/serviceMatter/${encodeURIComponent(matterId)}/action/resolve`
  );
  return response.data;
}
