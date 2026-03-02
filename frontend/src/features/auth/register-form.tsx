'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { registerRequest } from '@/entities/auth/api/auth.client';
import { setAuthUser } from '@/entities/auth/model/auth.slice';
import { useAppDispatch } from '@/shared/store/hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (user) => {
      dispatch(setAuthUser(user));
      router.push('/');
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Falha ao registrar.');
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    mutation.mutate({
      username: String(form.get('username') ?? ''),
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input name="username" label="Nome de usuario" required />
      <Input name="email" type="email" label="E-mail" required />
      <Input name="password" type="password" label="Senha forte" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Registrando...' : 'Criar conta'}
      </Button>
    </form>
  );
}
