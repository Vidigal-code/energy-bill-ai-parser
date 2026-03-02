'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { loginRequest } from '@/entities/auth/api/auth.client';
import { setAuthUser } from '@/entities/auth/model/auth.slice';
import { useAppDispatch } from '@/shared/store/hooks';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      dispatch(setAuthUser(user));
      router.push('/');
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Falha ao autenticar.');
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    mutation.mutate({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input name="email" type="email" label="E-mail" required />
      <Input name="password" type="password" label="Senha" required />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
