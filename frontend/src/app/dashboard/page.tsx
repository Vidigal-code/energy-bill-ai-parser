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
            <p className="text-sm text-[var(--danger)]">
              {dashboard.error instanceof Error
                ? dashboard.error.message
                : 'Falha ao carregar dashboard.'}
            </p>
          ) : null}
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricHighlight
              label="Consumo (kWh)"
              value={formatNumber(dashboard.data?.consumoEnergiaEletricaKwh ?? 0)}
            />
            <MetricHighlight
              label="Energia compensada (kWh)"
              value={formatNumber(dashboard.data?.energiaCompensadaKwh ?? 0)}
            />
            <MetricHighlight
              label="Valor sem GD (R$)"
              value={formatCurrency(dashboard.data?.valorTotalSemGdRs ?? 0)}
            />
            <MetricHighlight
              label="Economia GD (R$)"
              value={formatCurrency(dashboard.data?.economiaGdRs ?? 0)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Resultados de Energia (kWh)">
              <p className="text-sm text-[var(--text-secondary)]">
                Consumo de energia: {formatNumber(dashboard.data?.consumoEnergiaEletricaKwh ?? 0)}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Energia compensada: {formatNumber(dashboard.data?.energiaCompensadaKwh ?? 0)}
              </p>
            </Card>
            <Card title="Resultados Financeiros (R$)">
              <p className="text-sm text-[var(--text-secondary)]">
                Valor total sem GD: {formatCurrency(dashboard.data?.valorTotalSemGdRs ?? 0)}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Economia GD: {formatCurrency(dashboard.data?.economiaGdRs ?? 0)}
              </p>
            </Card>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

function MetricHighlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
