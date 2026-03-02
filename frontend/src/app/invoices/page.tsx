'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import {
  listInvoices,
  listMyDocuments,
  uploadInvoice,
} from '@/entities/invoice/api/invoice.client';

export default function InvoicesPage() {
  const queryClient = useQueryClient();
  const [numeroCliente, setNumeroCliente] = useState('');
  const [mesReferencia, setMesReferencia] = useState('');
  const [message, setMessage] = useState('');

  const invoicesQuery = useQuery({
    queryKey: ['invoices', numeroCliente, mesReferencia],
    queryFn: () => listInvoices({ numeroCliente, mesReferencia }),
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
    uploadMutation.mutate(file);
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="grid gap-4">
          <Card title="Upload e processamento de fatura">
            <form className="flex flex-col gap-3 md:max-w-xl" onSubmit={handleUpload}>
              <Input label="Arquivo PDF" name="file" type="file" accept="application/pdf" />
              <Button type="submit" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Processando...' : 'Enviar PDF'}
              </Button>
            </form>
            {message ? <p className="mt-3 text-sm text-emerald-900">{message}</p> : null}
          </Card>

          <Card title="Biblioteca de faturas">
            <div className="mb-4 grid gap-3 md:grid-cols-2">
              <Input
                label="Filtro numero cliente"
                value={numeroCliente}
                onChange={(event) => setNumeroCliente(event.target.value)}
              />
              <Input
                label="Filtro mes referencia"
                value={mesReferencia}
                onChange={(event) => setMesReferencia(event.target.value)}
              />
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-100">
                  <tr>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Numero cliente</th>
                    <th className="px-3 py-2">Mes referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoicesQuery.data ?? []).map((invoice) => (
                    <tr key={invoice.id} className="border-b border-emerald-100">
                      <td className="px-3 py-2">{invoice.fileName}</td>
                      <td className="px-3 py-2">{invoice.numeroCliente}</td>
                      <td className="px-3 py-2">{invoice.mesReferencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Meus documentos enviados">
            <pre className="overflow-auto rounded bg-emerald-950 p-3 text-xs text-emerald-100">
              {JSON.stringify(docsQuery.data ?? [], null, 2)}
            </pre>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
