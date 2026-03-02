'use client';

import { apiClient } from '@/shared/api/client';
import { unwrapApiResponse, type ApiEnvelope } from '@/shared/api/types';

export async function listAdminUsers() {
  const response = await apiClient.get<ApiEnvelope<Record<string, unknown>[]>>(
    '/admin/users',
  );
  return unwrapApiResponse(response.data);
}

export async function createAdminUser(payload: {
  email: string;
  username: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}) {
  const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
    '/admin/users',
    payload,
  );
  return unwrapApiResponse(response.data);
}

export async function updateAdminUser(
  userId: string,
  payload: {
    username?: string;
    password?: string;
    role?: 'ADMIN' | 'USER';
    isActive?: boolean;
  },
) {
  const response = await apiClient.patch<ApiEnvelope<Record<string, unknown>>>(
    `/admin/users/${userId}`,
    payload,
  );
  return unwrapApiResponse(response.data);
}

export async function deleteAdminUser(userId: string) {
  const response = await apiClient.delete<ApiEnvelope<Record<string, unknown>>>(
    `/admin/users/${userId}`,
  );
  return unwrapApiResponse(response.data);
}

export async function listAdminInvoices() {
  const response = await apiClient.get<ApiEnvelope<Record<string, unknown>[]>>(
    '/admin/invoices',
  );
  return unwrapApiResponse(response.data);
}

export async function updateAdminInvoiceReferenceMonth(
  invoiceId: string,
  mesReferencia: string,
) {
  const response = await apiClient.patch<ApiEnvelope<Record<string, unknown>>>(
    `/admin/invoices/${invoiceId}/reference-month`,
    { mesReferencia },
  );
  return unwrapApiResponse(response.data);
}

export async function deleteAdminInvoice(invoiceId: string) {
  const response = await apiClient.delete<ApiEnvelope<Record<string, unknown>>>(
    `/admin/invoices/${invoiceId}`,
  );
  return unwrapApiResponse(response.data);
}

export async function listAdminDocuments() {
  const response = await apiClient.get<ApiEnvelope<Record<string, unknown>[]>>(
    '/admin/documents',
  );
  return unwrapApiResponse(response.data);
}

export async function downloadAdminDocument(documentId: string) {
  const response = await apiClient.get<
    ApiEnvelope<{ fileName: string; mimeType: string; contentBase64: string }>
  >(`/admin/documents/${documentId}/download`);
  return unwrapApiResponse(response.data);
}

export async function deleteAdminDocument(documentId: string) {
  const response = await apiClient.delete<ApiEnvelope<Record<string, unknown>>>(
    `/admin/documents/${documentId}`,
  );
  return unwrapApiResponse(response.data);
}

export async function listAdminAuditLogs() {
  const response = await apiClient.get<ApiEnvelope<Record<string, unknown>[]>>(
    '/admin/audit-logs',
  );
  return unwrapApiResponse(response.data);
}
