'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/shared/store/hooks';

type RequireAuthProps = {
  children: React.ReactNode;
  role?: 'ADMIN' | 'USER';
};

export function RequireAuth({ children, role }: RequireAuthProps) {
  const router = useRouter();
  const { user, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (role && user.role !== role) {
      router.replace('/');
    }
  }, [initialized, role, router, user]);

  if (!initialized || !user) {
    return <p className="p-6 text-sm text-emerald-800">Carregando sessao...</p>;
  }

  if (role && user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
