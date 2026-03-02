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
  periodoInicio?: string;
  periodoFim?: string;
  page?: number;
  pageSize?: number;
}) {
  const response = await apiClient.get<ApiEnvelope<InvoiceRecord[]>>('/invoices', {
    params,
  });
  return unwrapApiResponse(response.data);
}

export type ConsolidatedDashboard = {
  consumoEnergiaEletricaKwh: number;
  energiaCompensadaKwh: number;
  valorTotalSemGdRs: number;
  economiaGdRs: number;
};

export async function getConsolidatedDashboard() {
  const response = await apiClient.get<
    ApiEnvelope<ConsolidatedDashboard>
  >('/invoices/dashboard/consolidated');
  return unwrapApiResponse(response.data);
}

export async function getEnergyDashboard() {
  const consolidated = await getConsolidatedDashboard();
  return {
    consumoEnergiaEletricaKwh: consolidated.consumoEnergiaEletricaKwh,
    energiaCompensadaKwh: consolidated.energiaCompensadaKwh,
  };
}

export async function getFinancialDashboard() {
  const consolidated = await getConsolidatedDashboard();
  return {
    valorTotalSemGdRs: consolidated.valorTotalSemGdRs,
    economiaGdRs: consolidated.economiaGdRs,
  };
}

export async function listMyDocuments() {
  const response = await apiClient.get<ApiEnvelope<DocumentRecord[]>>(
    '/invoices/my-documents',
  );
  return unwrapApiResponse(response.data);
}

export type DocumentRecord = {
  id: string;
  invoiceId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  createdAt: string;
};

export async function uploadInvoice(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
    '/invoices/extract',
    formData,
  );
  return unwrapApiResponse(response.data);
}
