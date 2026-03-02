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

  const invoicesQuery = useQuery({
    queryKey: [
      'invoices',
      filters.numeroCliente,
      filters.periodoInicio,
      filters.periodoFim,
    ],
    queryFn: () =>
      listInvoices({
        numeroCliente: filters.numeroCliente || undefined,
        periodoInicio: filters.periodoInicio || undefined,
        periodoFim: filters.periodoFim || undefined,
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
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
      void queryClient.invalidateQueries({ queryKey: ['my-documents'] });
    },
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : 'Falha ao processar arquivo.');
    },
  });

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const form = new FormData(event.currentTarget);
    const file = form.get('file');
    if (!(file instanceof File)) {
      setMessage('Selecione um arquivo PDF.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setMessage('Apenas arquivos PDF sao suportados.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setMessage('Arquivo excede o limite de 50MB.');
      return;
    }
    uploadMutation.mutate(file);
  }

  function handleApplyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters({
      numeroCliente: numeroClienteInput.trim(),
      periodoInicio: periodoInicioInput.trim(),
      periodoFim: periodoFimInput.trim(),
    });
  }

  function handleClearFilters() {
    setNumeroClienteInput('');
    setPeriodoInicioInput('');
    setPeriodoFimInput('');
    setFilters({ numeroCliente: '', periodoInicio: '', periodoFim: '' });
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
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{message}</p>
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
              <p className="mb-3 text-sm text-red-700">
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
          </Card>

          <Card title="Meus documentos enviados">
            {docsQuery.isError ? (
              <p className="mb-3 text-sm text-red-700">
                {docsQuery.error instanceof Error
                  ? docsQuery.error.message
                  : 'Falha ao carregar documentos.'}
              </p>
            ) : null}
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text-primary)]">
              {JSON.stringify(docsQuery.data ?? [], null, 2)}
            </pre>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
