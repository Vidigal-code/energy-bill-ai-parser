'use client';

import { apiClient } from '@/shared/api/client';
import { unwrapApiResponse, type ApiEnvelope } from '@/shared/api/types';

export type InvoiceRecord = {
  id: string;
  fileName: string;
  numeroCliente: string;
  mesReferencia: string;
  createdAt: string;
  metrics?: {
    consumoEnergiaEletricaKwh: number;
    energiaCompensadaKwh: number;
    valorTotalSemGdRs: number;
    economiaGdRs: number;
  };
};

export async function listInvoices(params?: {
  numeroCliente?: string;
  mesReferencia?: string;
}) {
  const response = await apiClient.get<ApiEnvelope<InvoiceRecord[]>>('/invoices', {
    params,
  });
  return unwrapApiResponse(response.data);
}

export async function getEnergyDashboard() {
  const response = await apiClient.get<
    ApiEnvelope<{ consumoEnergiaEletricaKwh: number; energiaCompensadaKwh: number }>
  >('/invoices/dashboard/energy');
  return unwrapApiResponse(response.data);
}

export async function getFinancialDashboard() {
  const response = await apiClient.get<
    ApiEnvelope<{ valorTotalSemGdRs: number; economiaGdRs: number }>
  >('/invoices/dashboard/financial');
  return unwrapApiResponse(response.data);
}

export async function listMyDocuments() {
  const response = await apiClient.get<ApiEnvelope<Record<string, unknown>[]>>(
    '/invoices/my-documents',
  );
  return unwrapApiResponse(response.data);
}

export async function uploadInvoice(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
    '/invoices/extract',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return unwrapApiResponse(response.data);
}
