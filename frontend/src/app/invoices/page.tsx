'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { MonthSelector } from '@/shared/ui/month-selector';
import {
  listInvoices,
  listMyDocuments,
  uploadInvoice,
} from '@/entities/invoice/api/invoice.client';

export default function InvoicesPage() {
  const pageSize = 10;
  const queryClient = useQueryClient();
  const [numeroClienteInput, setNumeroClienteInput] = useState('');
  const [periodoInicioInput, setPeriodoInicioInput] = useState('');
  const [periodoFimInput, setPeriodoFimInput] = useState('');
  const [filters, setFilters] = useState({
    numeroCliente: '',
    periodoInicio: '',
    periodoFim: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [page, setPage] = useState(1);

  const invoicesQuery = useQuery({
    queryKey: [
      'invoices',
      filters.numeroCliente,
      filters.periodoInicio,
      filters.periodoFim,
      page,
      pageSize,
    ],
    queryFn: () =>
      listInvoices({
        numeroCliente: filters.numeroCliente || undefined,
        periodoInicio: filters.periodoInicio || undefined,
        periodoFim: filters.periodoFim || undefined,
        page,
        pageSize,
      }),
  });

  const docsQuery = useQuery({
    queryKey: ['my-documents'],
    queryFn: listMyDocuments,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadInvoice,
    onSuccess: () => {
      setMessage('Arquivo processado com sucesso.');
      setMessageType('success');
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
      void queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : 'Falha ao processar arquivo.');
      setMessageType('error');
    },
  });

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setMessageType('info');
    const form = new FormData(event.currentTarget);
    const file = form.get('file');
    if (!(file instanceof File)) {
      setMessage('Selecione um arquivo PDF.');
      setMessageType('error');
      return;
    }
    if (file.type !== 'application/pdf') {
      setMessage('Apenas arquivos PDF sao suportados.');
      setMessageType('error');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setMessage('Arquivo excede o limite de 50MB.');
      setMessageType('error');
      return;
    }
    uploadMutation.mutate(file);
  }

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inicioKey = toMonthKey(periodoInicioInput);
    const fimKey = toMonthKey(periodoFimInput);
    if (inicioKey !== null && fimKey !== null && inicioKey > fimKey) {
      setMessage('Periodo invalido: o inicio deve ser menor ou igual ao fim.');
      setMessageType('error');
      return;
    }
    setFilters({
      numeroCliente: numeroClienteInput.trim(),
      periodoInicio: periodoInicioInput.trim(),
      periodoFim: periodoFimInput.trim(),
    });
    setPage(1);
  }

  function handleClearFilters() {
    setNumeroClienteInput('');
    setPeriodoInicioInput('');
    setPeriodoFimInput('');
    setFilters({ numeroCliente: '', periodoInicio: '', periodoFim: '' });
    setPage(1);
    setMessage('');
    setMessageType('info');
  }

  function renderMessageClass() {
    if (messageType === 'error') {
      return 'mt-3 text-sm text-[var(--danger)]';
    }
    if (messageType === 'success') {
      return 'mt-3 text-sm text-[var(--accent-strong)]';
    }
    return 'mt-3 text-sm text-[var(--text-secondary)]';
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-4">
          <Card title="Upload e processamento de fatura">
            <form
              className="mx-auto flex w-full max-w-5xl flex-col gap-3"
              onSubmit={handleUpload}
            >
              <Input label="Arquivo PDF" name="file" type="file" accept="application/pdf" />
              <Button type="submit" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Processando...' : 'Enviar PDF'}
              </Button>
            </form>
            {message ? (
              <p className={renderMessageClass()}>{message}</p>
            ) : null}
          </Card>

          <Card title="Biblioteca de faturas">
            <form
              className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
              onSubmit={handleApplyFilters}
            >
              <Input
                label="Filtro numero cliente"
                value={numeroClienteInput}
                onChange={(event) => setNumeroClienteInput(event.target.value)}
              />
              <MonthSelector
                label="Periodo inicio"
                value={periodoInicioInput}
                onChange={setPeriodoInicioInput}
              />
              <MonthSelector
                label="Periodo fim"
                value={periodoFimInput}
                onChange={setPeriodoFimInput}
              />
              <div className="flex items-end gap-2 md:col-span-2 xl:col-span-1">
                <Button type="submit">Aplicar filtros</Button>
                <Button type="button" onClick={handleClearFilters}>
                  Limpar
                </Button>
              </div>
            </form>
            {invoicesQuery.isError ? (
              <p className="mb-3 text-sm text-[var(--danger)]">
                {invoicesQuery.error instanceof Error
                  ? invoicesQuery.error.message
                  : 'Falha ao carregar as faturas.'}
              </p>
            ) : null}
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-primary)]">
                  <tr>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Numero cliente</th>
                    <th className="px-3 py-2">Mes referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoicesQuery.data ?? []).map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[var(--border-color)]">
                      <td className="px-3 py-2">{invoice.fileName}</td>
                      <td className="px-3 py-2">{invoice.numeroCliente}</td>
                      <td className="px-3 py-2">{invoice.mesReferencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {(invoicesQuery.data ?? []).map((invoice) => (
                <article
                  key={`mobile-invoice-${invoice.id}`}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]"
                >
                  <p className="break-all"><strong>Arquivo:</strong> {invoice.fileName}</p>
                  <p className="break-all"><strong>Numero cliente:</strong> {invoice.numeroCliente}</p>
                  <p><strong>Mes referencia:</strong> {invoice.mesReferencia}</p>
                </article>
              ))}
            </div>
            {invoicesQuery.isLoading ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">Carregando faturas...</p>
            ) : null}
            {!invoicesQuery.isLoading && !invoicesQuery.isError && (invoicesQuery.data ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Nenhuma fatura encontrada para os filtros informados.
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--border-color)] bg-[var(--surface-2)] p-2 text-sm text-[var(--text-primary)]">
              <span>Pagina atual: {page}</span>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                  Pagina anterior
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={invoicesQuery.isLoading || (invoicesQuery.data ?? []).length < pageSize}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Proxima pagina
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Meus documentos enviados">
            {docsQuery.isError ? (
              <p className="mb-3 text-sm text-[var(--danger)]">
                {docsQuery.error instanceof Error
                  ? docsQuery.error.message
                  : 'Falha ao carregar documentos.'}
              </p>
            ) : null}
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-primary)]">
                  <tr>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Tamanho</th>
                    <th className="px-3 py-2">Criado em</th>
                  </tr>
                </thead>
                <tbody>
                  {(docsQuery.data ?? []).map((doc) => (
                    <tr key={doc.id} className="border-b border-[var(--border-color)]">
                      <td className="px-3 py-2 break-all">{doc.fileName}</td>
                      <td className="px-3 py-2 break-all">{doc.mimeType}</td>
                      <td className="px-3 py-2">{formatBytes(doc.sizeBytes)}</td>
                      <td className="px-3 py-2">{formatDate(doc.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {(docsQuery.data ?? []).map((doc) => (
                <article
                  key={`mobile-doc-${doc.id}`}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]"
                >
                  <p className="break-all"><strong>Arquivo:</strong> {doc.fileName}</p>
                  <p className="break-all"><strong>Tipo:</strong> {doc.mimeType}</p>
                  <p><strong>Tamanho:</strong> {formatBytes(doc.sizeBytes)}</p>
                  <p><strong>Criado em:</strong> {formatDate(doc.createdAt)}</p>
                </article>
              ))}
            </div>
            {docsQuery.isLoading ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">Carregando documentos...</p>
            ) : null}
            {!docsQuery.isLoading && !docsQuery.isError && (docsQuery.data ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Nenhum documento enviado ate o momento.
              </p>
            ) : null}
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

function toMonthKey(value: string) {
  if (!value) {
    return null;
  }
  const isoMatch = value.trim().match(/^(\d{4})-(\d{2})$/);
  if (isoMatch) {
    const parsedYear = Number.parseInt(isoMatch[1], 10);
    const parsedMonth = Number.parseInt(isoMatch[2], 10);
    if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth)) {
      return null;
    }
    return parsedYear * 100 + parsedMonth;
  }

  const slashMatch = value.trim().match(/^([A-Za-z]{3}|\d{1,2})\/(\d{4})$/);
  if (!slashMatch) {
    return null;
  }
  const monthToken = slashMatch[1].toLowerCase();
  const parsedYear = Number.parseInt(slashMatch[2], 10);
  const months: Record<string, number> = {
    jan: 1,
    fev: 2,
    mar: 3,
    abr: 4,
    mai: 5,
    jun: 6,
    jul: 7,
    ago: 8,
    set: 9,
    out: 10,
    nov: 11,
    dez: 12,
  };
  const parsedMonth =
    monthToken in months
      ? months[monthToken]
      : Number.parseInt(monthToken, 10);
  if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth)) {
    return null;
  }
  return parsedYear * 100 + parsedMonth;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
