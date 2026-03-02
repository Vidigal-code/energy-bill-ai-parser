'use client';

import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  createAdminUser,
  deleteAdminDocument,
  deleteAdminInvoice,
  deleteAdminUser,
  downloadAdminDocument,
  listAdminAuditLogs,
  listAdminDocuments,
  listAdminInvoices,
  listAdminUsers,
  updateAdminInvoiceReferenceMonth,
  updateAdminUser,
} from '@/entities/admin/api/admin.client';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState('');
  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: listAdminUsers,
  });
  const invoicesQuery = useQuery({
    queryKey: ['admin', 'invoices'],
    queryFn: listAdminInvoices,
  });
  const documentsQuery = useQuery({
    queryKey: ['admin', 'documents'],
    queryFn: listAdminDocuments,
  });
  const auditsQuery = useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: listAdminAuditLogs,
  });

  const invalidateAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'invoices'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'documents'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] }),
    ]);
  };

  const createUserMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: async () => {
      setFeedback('Usuario criado com sucesso.');
      await invalidateAll();
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: 'ADMIN' | 'USER';
    }) => updateAdminUser(userId, { role }),
    onSuccess: async () => {
      setFeedback('Usuario atualizado com sucesso.');
      await invalidateAll();
    },
  });
  const deleteUserMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: async () => {
      setFeedback('Usuario removido com sucesso.');
      await invalidateAll();
    },
  });
  const updateInvoiceMutation = useMutation({
    mutationFn: ({
      invoiceId,
      mesReferencia,
    }: {
      invoiceId: string;
      mesReferencia: string;
    }) => updateAdminInvoiceReferenceMonth(invoiceId, mesReferencia),
    onSuccess: async () => {
      setFeedback('Fatura atualizada com sucesso.');
      await invalidateAll();
    },
  });
  const deleteInvoiceMutation = useMutation({
    mutationFn: deleteAdminInvoice,
    onSuccess: async () => {
      setFeedback('Fatura removida com sucesso.');
      await invalidateAll();
    },
  });
  const deleteDocumentMutation = useMutation({
    mutationFn: deleteAdminDocument,
    onSuccess: async () => {
      setFeedback('Documento removido com sucesso.');
      await invalidateAll();
    },
  });

  function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createUserMutation.mutate({
      email: String(formData.get('email') ?? ''),
      username: String(formData.get('username') ?? ''),
      password: String(formData.get('password') ?? ''),
      role: String(formData.get('role') ?? 'USER') as 'ADMIN' | 'USER',
    });
  }

  async function handleDownload(documentId: string) {
    const payload = await downloadAdminDocument(documentId);
    const link = document.createElement('a');
    link.href = `data:${payload.mimeType};base64,${payload.contentBase64}`;
    link.download = payload.fileName;
    link.click();
  }

  return (
    <RequireAuth role="ADMIN">
      <AppShell>
        <div className="grid gap-4">
          {feedback ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-100 p-3 text-sm text-emerald-900">
              {feedback}
            </p>
          ) : null}
          <Card title="Usuarios (admin)">
            <form
              onSubmit={handleCreateUser}
              className="mb-4 grid gap-2 rounded border border-emerald-100 p-3 md:grid-cols-4"
            >
              <Input label="E-mail" name="email" required />
              <Input label="Usuario" name="username" required />
              <Input label="Senha" name="password" type="password" required />
              <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
                <span>Papel</span>
                <select
                  className="rounded-lg border border-emerald-200 px-3 py-2"
                  name="role"
                  defaultValue="USER"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
              <Button type="submit" className="md:col-span-4">
                Criar usuario
              </Button>
            </form>
            <div className="overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-100">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Username</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {(usersQuery.data ?? []).map((user) => (
                    <tr
                      key={String(user.id)}
                      className="border-b border-emerald-100 align-top"
                    >
                      <td className="px-3 py-2">{String(user.id)}</td>
                      <td className="px-3 py-2">{String(user.email)}</td>
                      <td className="px-3 py-2">{String(user.username)}</td>
                      <td className="px-3 py-2">{String(user.role)}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              updateUserMutation.mutate({
                                userId: String(user.id),
                                role:
                                  String(user.role) === 'ADMIN' ? 'USER' : 'ADMIN',
                              })
                            }
                          >
                            Alternar role
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              deleteUserMutation.mutate(String(user.id))
                            }
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Faturas (admin)">
            <div className="overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-100">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Mes</th>
                    <th className="px-3 py-2">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoicesQuery.data ?? []).map((invoice) => (
                    <tr key={String(invoice.id)} className="border-b border-emerald-100">
                      <td className="px-3 py-2">{String(invoice.id)}</td>
                      <td className="px-3 py-2">{String(invoice.fileName)}</td>
                      <td className="px-3 py-2">{String(invoice.mesReferencia)}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              const mes = prompt(
                                'Novo mesReferencia:',
                                String(invoice.mesReferencia),
                              );
                              if (mes) {
                                updateInvoiceMutation.mutate({
                                  invoiceId: String(invoice.id),
                                  mesReferencia: mes,
                                });
                              }
                            }}
                          >
                            Editar mes
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              deleteInvoiceMutation.mutate(String(invoice.id))
                            }
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Documentos (admin)">
            <div className="overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-100">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {(documentsQuery.data ?? []).map((document) => (
                    <tr
                      key={String(document.id)}
                      className="border-b border-emerald-100"
                    >
                      <td className="px-3 py-2">{String(document.id)}</td>
                      <td className="px-3 py-2">{String(document.fileName)}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleDownload(String(document.id))}
                          >
                            Download
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              deleteDocumentMutation.mutate(String(document.id))
                            }
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Auditoria (admin)">
            <pre className="overflow-auto rounded bg-emerald-950 p-3 text-xs text-emerald-100">
              {JSON.stringify(auditsQuery.data ?? [], null, 2)}
            </pre>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
