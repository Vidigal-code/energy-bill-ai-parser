import Link from 'next/link';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';

export default function Home() {
  return (
    <RequireAuth>
      <AppShell>
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Upload e processamento">
            <p className="mb-3 text-sm text-emerald-900">
              Envie e processe faturas PDF com extração via IA.
            </p>
            <Link className="text-sm font-semibold text-emerald-700" href="/invoices">
              Acessar modulo de faturas
            </Link>
          </Card>
          <Card title="Dashboards e controle">
            <p className="mb-3 text-sm text-emerald-900">
              Consulte consolidado energético e financeiro.
            </p>
            <Link className="text-sm font-semibold text-emerald-700" href="/dashboard">
              Ver dashboards
            </Link>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
