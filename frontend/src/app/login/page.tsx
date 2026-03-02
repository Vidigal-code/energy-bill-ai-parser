import Link from 'next/link';
import { LoginForm } from '@/features/auth/login-form';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[var(--text-primary)]">Entrar</h1>
        <p className="mb-5 text-sm text-[var(--text-secondary)]">
          Acesse a plataforma enterprise de faturas.
        </p>
        <LoginForm />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Nao tem conta?{' '}
          <Link href="/register" className="font-semibold text-[var(--accent)]">
            Registrar
          </Link>
        </p>
      </section>
    </main>
  );
}
