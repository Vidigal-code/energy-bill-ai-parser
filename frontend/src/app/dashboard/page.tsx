'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/widgets/app-shell/app-shell';
import { RequireAuth } from '@/features/session/require-auth';
import { Card } from '@/shared/ui/card';
import {
  getEnergyDashboard,
  getFinancialDashboard,
} from '@/entities/invoice/api/invoice.client';

export default function DashboardPage() {
  const energy = useQuery({
    queryKey: ['dashboard', 'energy'],
    queryFn: getEnergyDashboard,
  });

  const financial = useQuery({
    queryKey: ['dashboard', 'financial'],
    queryFn: getFinancialDashboard,
  });

  return (
    <RequireAuth>
      <AppShell>
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Resultados de Energia (kWh)">
            <p className="text-sm text-emerald-900">
              Consumo de energia: {energy.data?.consumoEnergiaEletricaKwh ?? 0}
            </p>
            <p className="text-sm text-emerald-900">
              Energia compensada: {energy.data?.energiaCompensadaKwh ?? 0}
            </p>
          </Card>
          <Card title="Resultados Financeiros (R$)">
            <p className="text-sm text-emerald-900">
              Valor total sem GD: {financial.data?.valorTotalSemGdRs ?? 0}
            </p>
            <p className="text-sm text-emerald-900">
              Economia GD: {financial.data?.economiaGdRs ?? 0}
            </p>
          </Card>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
