'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { logoutRequest } from '@/entities/auth/api/auth.client';
import { clearAuthUser } from '@/entities/auth/model/auth.slice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { Button } from '@/shared/ui/button';

type AppShellProps = {
  children: React.ReactNode;
};

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/invoices', label: 'Faturas' },
  { href: '/dashboard', label: 'Dashboards' },
  { href: '/profile', label: 'Perfil' },
  { href: '/admin', label: 'Admin' },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(clearAuthUser());
      router.push('/login');
    },
  });

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="border-b border-emerald-200 bg-emerald-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">Energy Bill Platform</h1>
            <p className="text-xs text-emerald-200">
              {user ? `${user.username} (${user.role})` : 'Nao autenticado'}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {links
              .filter((link) => user?.role === 'ADMIN' || link.href !== '/admin')
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1 text-sm ${
                    pathname === link.href
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            {user && (
              <Button
                variant="ghost"
                className="border-emerald-300 text-emerald-100 hover:bg-emerald-800"
                onClick={() => logoutMutation.mutate()}
              >
                Sair
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
