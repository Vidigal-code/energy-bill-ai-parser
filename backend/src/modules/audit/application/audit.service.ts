import { Injectable } from '@nestjs/common';
import { AuditStatus, Prisma } from '@prisma/client';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';
import { PrismaService } from '../../../shared/prisma/prisma.service';

type WriteAuditInput = {
  actorUserId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  status: AuditStatus;
  message: string;
  meta?: unknown;
  ip?: string;
  userAgent?: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async write(input: WriteAuditInput): Promise<void> {
    ApiLogger.info({
      context: 'AuditService',
      message: PtBrMessages.logs.audit.writingEntry(input.action),
    });
    await this.prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        status: input.status,
        message: input.message,
        meta: input.meta as Prisma.InputJsonValue | undefined,
        ip: input.ip,
        userAgent: input.userAgent,
      },
    });
  }
}
