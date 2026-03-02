'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('theme-dark')
        ? 'dark'
        : 'light';
    }
    return 'light';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      dispatch(clearAuthUser());
      router.push('/login');
      setMobileMenuOpen(false);
    },
  });

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    html.classList.remove('theme-light', 'theme-dark');
    html.classList.add(nextTheme === 'dark' ? 'theme-dark' : 'theme-light');
    localStorage.setItem('ebill-theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--surface-0)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border-color)] bg-[var(--surface-1)]/95 text-[var(--text-primary)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="space-y-0.5">
            <h1 className="text-lg font-semibold tracking-tight">Energy Bill Platform</h1>
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              {user ? `${user.username} (${user.role})` : 'Nao autenticado'}
            </p>
          </div>
          <nav className="hidden flex-wrap items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-2)]/70 p-1 md:flex">
            {links
              .filter((link) => user?.role === 'ADMIN' || link.href !== '/admin')
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    pathname === link.href
                      ? 'bg-[var(--accent-strong)] !text-[var(--accent-contrast)] shadow-sm'
                      : 'text-[var(--text-primary)] hover:bg-[var(--surface-1)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </Button>
            {user && (
              <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
                Sair
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === 'dark' ? 'Claro' : 'Escuro'}
            </Button>
            <Button variant="ghost" onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? 'Fechar menu' : 'Menu'}
            </Button>
          </div>
          {mobileMenuOpen ? (
            <div className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-3 md:hidden">
              <nav className="grid gap-2">
                {links
                  .filter((link) => user?.role === 'ADMIN' || link.href !== '/admin')
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                        pathname === link.href
                          ? 'border-[var(--accent-strong)] bg-[var(--accent-strong)] !text-[var(--accent-contrast)]'
                          : 'border-[var(--border-color)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-1)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                {user ? (
                  <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
                    Sair
                  </Button>
                ) : null}
              </nav>
            </div>
          ) : null}
          <div className="h-px basis-full bg-[var(--border-color)]/70" />
          <p className="text-xs text-[var(--text-secondary)] sm:text-sm">
            Plataforma de analise e orquestracao de faturas com IA
          </p>
          <span className="rounded-full border border-[var(--border-color)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
            Ambiente: {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
