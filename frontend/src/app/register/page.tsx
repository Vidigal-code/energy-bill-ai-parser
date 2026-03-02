import Link from 'next/link';
import { RegisterForm } from '@/features/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <section className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-emerald-900">Criar conta</h1>
        <p className="mb-5 text-sm text-emerald-800">
          Registro com autenticação segura e RBAC.
        </p>
        <RegisterForm />
        <p className="mt-4 text-sm text-emerald-900">
          Ja possui conta?{' '}
          <Link href="/login" className="font-semibold text-emerald-700">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
