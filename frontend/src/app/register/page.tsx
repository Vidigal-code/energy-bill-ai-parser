import Link from 'next/link';
import { RegisterForm } from '@/features/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[var(--text-primary)]">Criar conta</h1>
        <p className="mb-5 text-sm text-[var(--text-secondary)]">
          Registro com autenticação segura e RBAC.
        </p>
        <RegisterForm />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Ja possui conta?{' '}
          <Link href="/login" className="font-semibold text-[var(--accent)]">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
