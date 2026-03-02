'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import { getConsolidatedDashboard } from '@/entities/invoice/api/invoice.client';

export default function DashboardPage() {
  const dashboard = useQuery({
    queryKey: ['dashboard', 'consolidated'],
    queryFn: getConsolidatedDashboard,
  });

  return (
    <RequireAuth>
      <AppShell>
        <div className="mx-auto w-full max-w-6xl">
          {dashboard.isLoading ? (
            <p className="text-sm text-[var(--text-secondary)]">Carregando dashboard...</p>
          ) : null}
          {dashboard.isError ? (
            <p className="text-sm text-red-700">
              {dashboard.error instanceof Error
                ? dashboard.error.message
                : 'Falha ao carregar dashboard.'}
            </p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Resultados de Energia (kWh)">
              <p className="text-sm text-[var(--text-secondary)]">
                Consumo de energia: {dashboard.data?.consumoEnergiaEletricaKwh ?? 0}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Energia compensada: {dashboard.data?.energiaCompensadaKwh ?? 0}
              </p>
            </Card>
            <Card title="Resultados Financeiros (R$)">
              <p className="text-sm text-[var(--text-secondary)]">
                Valor total sem GD: {(dashboard.data?.valorTotalSemGdRs ?? 0).toFixed(2)}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Economia GD: {(dashboard.data?.economiaGdRs ?? 0).toFixed(2)}
              </p>
            </Card>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
