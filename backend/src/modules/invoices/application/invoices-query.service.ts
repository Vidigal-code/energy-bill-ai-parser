import { Injectable } from '@nestjs/common';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { AppRole } from '../../auth/domain/role.type';

type ListInvoicesQuery = {
  numeroCliente?: string;
  mesReferencia?: string;
  page?: string;
  pageSize?: string;
  userId: string;
  role: AppRole;
};

@Injectable()
export class InvoicesQueryService {
  constructor(private readonly prisma: PrismaService) {}

  listInvoices(query: ListInvoicesQuery) {
    ApiLogger.info({
      context: 'InvoicesQueryService',
      message: PtBrMessages.logs.invoicesQuery.listingInvoices,
    });
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(query.pageSize ?? '20', 10) || 20),
    );

    return this.prisma.invoice.findMany({
      where: {
        numeroCliente: query.numeroCliente,
        mesReferencia: query.mesReferencia,
        uploaderUserId: query.role === 'ADMIN' ? undefined : query.userId,
      },
      include: {
        metrics: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async energyDashboard(userId: string, role: AppRole) {
    ApiLogger.info({
      context: 'InvoicesQueryService',
      message: PtBrMessages.logs.invoicesQuery.buildingEnergyDashboard,
    });
    const where = role === 'ADMIN' ? {} : { uploaderUserId: userId };
    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { metrics: true },
    });

    return invoices.reduce(
      (acc, invoice) => {
        acc.consumoEnergiaEletricaKwh += Number(
          invoice.metrics?.consumoEnergiaEletricaKwh ?? 0,
        );
        acc.energiaCompensadaKwh += Number(
          invoice.metrics?.energiaCompensadaKwh ?? 0,
        );
        return acc;
      },
      {
        consumoEnergiaEletricaKwh: 0,
        energiaCompensadaKwh: 0,
      },
    );
  }

  async financialDashboard(userId: string, role: AppRole) {
    ApiLogger.info({
      context: 'InvoicesQueryService',
      message: PtBrMessages.logs.invoicesQuery.buildingFinancialDashboard,
    });
    const where = role === 'ADMIN' ? {} : { uploaderUserId: userId };
    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { metrics: true },
    });

    return invoices.reduce(
      (acc, invoice) => {
        acc.valorTotalSemGdRs += Number(
          invoice.metrics?.valorTotalSemGdRs ?? 0,
        );
        acc.economiaGdRs += Number(invoice.metrics?.economiaGdRs ?? 0);
        return acc;
      },
      {
        valorTotalSemGdRs: 0,
        economiaGdRs: 0,
      },
    );
  }

  listMyDocuments(userId: string) {
    ApiLogger.info({
      context: 'InvoicesQueryService',
      message: PtBrMessages.logs.invoicesQuery.listingMyDocuments,
    });
    return this.prisma.storedDocument.findMany({
      where: { uploaderUserId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        invoiceId: true,
        fileName: true,
        mimeType: true,
        sizeBytes: true,
        checksum: true,
        createdAt: true,
      },
    });
  }
}
