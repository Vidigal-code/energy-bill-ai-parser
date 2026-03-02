'use client';

import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { updateProfileRequest } from '@/entities/auth/api/auth.client';
import { setAuthUser } from '@/entities/auth/model/auth.slice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  const mutation = useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: (updatedUser) => {
      dispatch(setAuthUser(updatedUser));
      setMessage('Perfil atualizado com sucesso.');
    },
    onError: (err) => {
      setMessage(err instanceof Error ? err.message : 'Falha ao atualizar perfil.');
    },
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      username: String(formData.get('username') ?? '') || undefined,
      password: String(formData.get('password') ?? '') || undefined,
    });
  }

  return (
    <RequireAuth>
      <AppShell>
        <div className="mx-auto w-full max-w-3xl">
          <Card title="Meu perfil">
            <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
              <Input
                label="Nome de usuario"
                name="username"
                defaultValue={user?.username}
              />
              <Input
                label="Nova senha (opcional)"
                type="password"
                name="password"
                placeholder="Deixe em branco para nao alterar"
              />
              <Button type="submit" disabled={mutation.isPending} className="sm:w-fit">
                {mutation.isPending ? 'Salvando...' : 'Salvar alteracoes'}
              </Button>
            </form>
            {message ? (
              <p className="mt-4 text-sm text-[var(--text-secondary)]">{message}</p>
            ) : null}
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
