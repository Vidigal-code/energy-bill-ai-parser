'use client';

import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
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

type RoleType = 'ADMIN' | 'USER';

type EditableUser = {
  id: string;
  username: string;
  role: RoleType;
  isActive: boolean;
};

type EditableInvoice = {
  id: string;
  mesReferencia: string;
};

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState('');
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<EditableInvoice | null>(null);
  const [editUserUsername, setEditUserUsername] = useState('');
  const [editUserRole, setEditUserRole] = useState<RoleType>('USER');
  const [editUserActive, setEditUserActive] = useState(true);
  const [editInvoiceMes, setEditInvoiceMes] = useState('');
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
      username,
      role,
      isActive,
    }: {
      userId: string;
      username?: string;
      role?: 'ADMIN' | 'USER';
      isActive?: boolean;
    }) => updateAdminUser(userId, { username, role, isActive }),
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

  function resolveRole(value: unknown): RoleType {
    return value === 'ADMIN' ? 'ADMIN' : 'USER';
  }

  function openUserModal(user: Record<string, unknown>) {
    const id = String(user.id ?? '');
    const username = String(user.username ?? '');
    const role = resolveRole(user.role);
    const isActive = Boolean(user.isActive ?? true);
    setEditingUser({ id, username, role, isActive });
    setEditUserUsername(username);
    setEditUserRole(role);
    setEditUserActive(isActive);
  }

  function openInvoiceModal(invoice: Record<string, unknown>) {
    const id = String(invoice.id ?? '');
    const mesReferencia = String(invoice.mesReferencia ?? '');
    setEditingInvoice({ id, mesReferencia });
    setEditInvoiceMes(mesReferencia);
  }

  function handleSaveUser() {
    if (!editingUser) {
      return;
    }

    updateUserMutation.mutate(
      {
        userId: editingUser.id,
        username: editUserUsername || undefined,
        role: editUserRole,
        isActive: editUserActive,
      },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      },
    );
  }

  function handleSaveInvoice() {
    if (!editingInvoice) {
      return;
    }

    updateInvoiceMutation.mutate(
      {
        invoiceId: editingInvoice.id,
        mesReferencia: editInvoiceMes,
      },
      {
        onSuccess: () => {
          setEditingInvoice(null);
        },
      },
    );
  }

  return (
    <RequireAuth role="ADMIN">
      <AppShell>
        <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-4">
          {feedback ? (
            <p className="rounded-md border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]">
              {feedback}
            </p>
          ) : null}
          <Card title="Usuarios (admin)">
            <form
              onSubmit={handleCreateUser}
              className="mb-4 grid gap-2 rounded border border-[var(--border-color)] p-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              <Input label="E-mail" name="email" required />
              <Input label="Usuario" name="username" required />
              <Input label="Senha" name="password" type="password" required />
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]">
                <span>Papel</span>
                <select
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] px-3 py-2 text-[var(--text-primary)]"
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
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-primary)]">
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
                      className="border-b border-[var(--border-color)] align-top"
                    >
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(user.id)}</td>
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(user.email)}</td>
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(user.username)}</td>
                      <td className="px-3 py-2 text-[var(--text-primary)]">{String(user.role)}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button variant="ghost" onClick={() => openUserModal(user)}>
                            Editar
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
            <div className="grid gap-3 md:hidden">
              {(usersQuery.data ?? []).map((user) => (
                <article
                  key={`mobile-user-${String(user.id)}`}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]"
                >
                  <p><strong>ID:</strong> {String(user.id)}</p>
                  <p><strong>Email:</strong> {String(user.email)}</p>
                  <p><strong>Usuario:</strong> {String(user.username)}</p>
                  <p><strong>Role:</strong> {String(user.role)}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button variant="ghost" onClick={() => openUserModal(user)}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteUserMutation.mutate(String(user.id))}
                    >
                      Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
          <Card title="Faturas (admin)">
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-primary)]">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Arquivo</th>
                    <th className="px-3 py-2">Mes</th>
                    <th className="px-3 py-2">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoicesQuery.data ?? []).map((invoice) => (
                    <tr key={String(invoice.id)} className="border-b border-[var(--border-color)]">
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(invoice.id)}</td>
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(invoice.fileName)}</td>
                      <td className="px-3 py-2 text-[var(--text-primary)]">{String(invoice.mesReferencia)}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button variant="ghost" onClick={() => openInvoiceModal(invoice)}>
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
            <div className="grid gap-3 md:hidden">
              {(invoicesQuery.data ?? []).map((invoice) => (
                <article
                  key={`mobile-invoice-${String(invoice.id)}`}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]"
                >
                  <p><strong>ID:</strong> {String(invoice.id)}</p>
                  <p><strong>Arquivo:</strong> {String(invoice.fileName)}</p>
                  <p><strong>Mes:</strong> {String(invoice.mesReferencia)}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button variant="ghost" onClick={() => openInvoiceModal(invoice)}>
                      Editar mes
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteInvoiceMutation.mutate(String(invoice.id))}
                    >
                      Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
          <Card title="Documentos (admin)">
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-primary)]">
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
                      className="border-b border-[var(--border-color)]"
                    >
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(document.id)}</td>
                      <td className="px-3 py-2 text-[var(--text-primary)] break-all">{String(document.fileName)}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-2 sm:flex-row">
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
            <div className="grid gap-3 md:hidden">
              {(documentsQuery.data ?? []).map((document) => (
                <article
                  key={`mobile-document-${String(document.id)}`}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]"
                >
                  <p><strong>ID:</strong> {String(document.id)}</p>
                  <p><strong>Arquivo:</strong> {String(document.fileName)}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button variant="ghost" onClick={() => handleDownload(String(document.id))}>
                      Download
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteDocumentMutation.mutate(String(document.id))}
                    >
                      Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
          <Card title="Auditoria (admin)">
            <div className="hidden min-w-0 overflow-x-auto md:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-primary)]">
                  <tr>
                    <th className="px-3 py-2">Acao</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Usuario</th>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditsQuery.data ?? []).map((log) => (
                    <tr
                      key={String(log.id)}
                      className="border-b border-[var(--border-color)] text-[var(--text-primary)]"
                    >
                      <td className="px-3 py-2 break-all">{readAuditValue(log, 'action')}</td>
                      <td className="px-3 py-2">{readAuditValue(log, 'status')}</td>
                      <td className="px-3 py-2 break-all">{resolveAuditUsername(log)}</td>
                      <td className="px-3 py-2">{formatDate(readAuditValue(log, 'createdAt'))}</td>
                      <td className="px-3 py-2 break-all">{readAuditValue(log, 'ip')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 md:hidden">
              {(auditsQuery.data ?? []).map((log) => (
                <article
                  key={`mobile-audit-${String(log.id)}`}
                  className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text-primary)]"
                >
                  <p><strong>Acao:</strong> {readAuditValue(log, 'action')}</p>
                  <p><strong>Status:</strong> {readAuditValue(log, 'status')}</p>
                  <p className="break-all"><strong>Usuario:</strong> {resolveAuditUsername(log)}</p>
                  <p><strong>Data:</strong> {formatDate(readAuditValue(log, 'createdAt'))}</p>
                  <p className="break-all"><strong>IP:</strong> {readAuditValue(log, 'ip')}</p>
                </article>
              ))}
            </div>
            {auditsQuery.isLoading ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">Carregando auditoria...</p>
            ) : null}
            {!auditsQuery.isLoading && !auditsQuery.isError && (auditsQuery.data ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Nenhum log de auditoria encontrado.
              </p>
            ) : null}
          </Card>
        </div>

        <Modal
          open={editingUser !== null}
          title="Editar usuario"
          onClose={() => setEditingUser(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditingUser(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={updateUserMutation.isPending || !editingUser}
              >
                {updateUserMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          }
        >
          <form className="grid gap-3">
            <Input
              label="Nome de usuario"
              value={editUserUsername}
              onChange={(event) => setEditUserUsername(event.target.value)}
            />
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]">
              <span>Role</span>
              <select
                className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] px-3 py-2 text-[var(--text-primary)]"
                value={editUserRole}
                onChange={(event) => setEditUserRole(resolveRole(event.target.value))}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={editUserActive}
                onChange={(event) => setEditUserActive(event.target.checked)}
              />
              Usuario ativo
            </label>
          </form>
        </Modal>

        <Modal
          open={editingInvoice !== null}
          title="Editar fatura"
          onClose={() => setEditingInvoice(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditingInvoice(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveInvoice}
                disabled={updateInvoiceMutation.isPending || !editingInvoice}
              >
                {updateInvoiceMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          }
        >
          <form className="grid gap-3">
            <Input
              label="Mes de referencia"
              value={editInvoiceMes}
              onChange={(event) => setEditInvoiceMes(event.target.value)}
              placeholder="Ex: JAN/2024"
            />
          </form>
        </Modal>
      </AppShell>
    </RequireAuth>
  );
}

function readAuditValue(log: Record<string, unknown>, key: string) {
  const value = log[key];
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}

function resolveAuditUsername(log: Record<string, unknown>) {
  const actor = log.actor;
  if (typeof actor !== 'object' || actor === null) {
    return '-';
  }
  const actorRecord = actor as Record<string, unknown>;
  return String(actorRecord.username ?? '-');
}

function formatDate(value: string) {
  if (!value || value === '-') {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
