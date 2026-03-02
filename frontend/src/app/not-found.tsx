'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { useAppSelector } from '@/shared/store/hooks';

export default function NotFound() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const targetPath = user ? '/dashboard' : '/';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface-0)] px-4 py-8">
      <section className="w-full max-w-xl rounded-2xl border border-[var(--border-color)] bg-[var(--surface-1)] p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Erro 404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          Pagina nao encontrada
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
          A rota que voce tentou acessar nao existe ou foi movida. Use uma das
          opcoes abaixo para continuar navegando na plataforma.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href={targetPath} className="w-full">
            <Button className="w-full">
              {user ? 'Ir para dashboard' : 'Ir para pagina principal'}
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.back()}
          >
            Voltar uma guia
          </Button>
        </div>
      </section>
    </main>
  );
}
