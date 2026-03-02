import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { FileCryptoService } from '../../storage/application/file-crypto.service';
import { DOCUMENT_STORAGE_TOKEN } from '../../storage/domain/document-storage.port';
import { Inject } from '@nestjs/common';
import type { DocumentStoragePort } from '../../storage/domain/document-storage.port';
import type { AppRole } from '../../auth/domain/role.type';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
} from '../presentation/dto/admin-upsert-user.dto';

type ListQuery = {
  fromDate?: string;
  toDate?: string;
  username?: string;
  page?: string;
  pageSize?: string;
};

@Injectable()
/**
 *
 * EN: Administrative application service for enterprise governance operations.
 *
 * PT: Servico de aplicacao administrativo para operacoes de governanca enterprise.
 *
 * @params Administrative DTOs and filtering query payloads.
 * @returns Aggregated management data and mutation outcomes.
 */
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(DOCUMENT_STORAGE_TOKEN)
    private readonly documentStorage: DocumentStoragePort,
    private readonly fileCryptoService: FileCryptoService,
  ) {}

  /**
   *
   * EN: Lists all users for administrative governance.
   *
   * PT: Lista todos os usuarios para governanca administrativa.
   *
   * @params none
   * @returns Users collection with role and status.
   */
  listUsers() {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.listingUsers,
    });
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   *
   * EN: Creates a user account from admin context.
   *
   * PT: Cria uma conta de usuario no contexto administrativo.
   *
   * @params input Admin DTO with user base data.
   * @returns Created user projection.
   */
  async createUser(input: AdminCreateUserDto) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.creatingUser,
    });
    const passwordHash = await argon2.hash(input.password);

    return this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.username,
        passwordHash,
        role: input.role ?? 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   *
   * EN: Applies administrative changes to a user account.
   *
   * PT: Aplica alteracoes administrativas em uma conta de usuario.
   *
   * @params userId Target user identifier.
   * @params input Admin DTO with editable fields.
   * @returns Updated user projection.
   */
  async updateUser(userId: string, input: AdminUpdateUserDto) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.updatingUser(userId),
    });
    const data: {
      username?: string;
      passwordHash?: string;
      role?: AppRole;
      isActive?: boolean;
    } = {};

    if (input.username) {
      data.username = input.username;
    }
    if (input.role) {
      data.role = input.role;
    }
    if (typeof input.isActive === 'boolean') {
      data.isActive = input.isActive;
    }
    if (input.password) {
      data.passwordHash = await argon2.hash(input.password);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   *
   * EN: Permanently removes a user from system scope.
   *
   * PT: Remove permanentemente um usuario do escopo do sistema.
   *
   * @params userId Target user identifier.
   * @returns Standardized deletion message.
   */
  async deleteUser(userId: string) {
    ApiLogger.warning({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.deletingUser(userId),
    });
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: PtBrMessages.admin.userRemoved };
  }

  listDocuments(query: ListQuery) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.listingDocuments,
    });
    const pagination = this.getPagination(query.page, query.pageSize);

    return this.prisma.storedDocument.findMany({
      where: {
        createdAt: {
          gte: query.fromDate ? new Date(query.fromDate) : undefined,
          lte: query.toDate ? new Date(query.toDate) : undefined,
        },
        uploader: {
          username: query.username,
        },
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    });
  }

  listAuditLogs(query: ListQuery) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.listingAuditLogs,
    });
    const pagination = this.getPagination(query.page, query.pageSize);

    return this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: query.fromDate ? new Date(query.fromDate) : undefined,
          lte: query.toDate ? new Date(query.toDate) : undefined,
        },
        actor: {
          username: query.username,
        },
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    });
  }

  listInvoices(query: ListQuery) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.listingInvoices,
    });
    const pagination = this.getPagination(query.page, query.pageSize);
    return this.prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: query.fromDate ? new Date(query.fromDate) : undefined,
          lte: query.toDate ? new Date(query.toDate) : undefined,
        },
        uploader: {
          username: query.username,
        },
      },
      include: {
        metrics: true,
        uploader: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    });
  }

  updateInvoiceReferenceMonth(invoiceId: string, mesReferencia: string) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.updatingInvoiceReferenceMonth(invoiceId),
    });
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { mesReferencia },
    });
  }

  async deleteInvoice(invoiceId: string) {
    ApiLogger.warning({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.deletingInvoice(invoiceId),
    });
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { documents: true },
    });
    if (!invoice) {
      throw new NotFoundException(PtBrMessages.admin.invoiceNotFound);
    }

    for (const document of invoice.documents) {
      await this.documentStorage.remove(document.objectKey);
    }

    await this.prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return { message: PtBrMessages.admin.invoiceRemoved };
  }

  async deleteDocument(documentId: string) {
    ApiLogger.warning({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.deletingDocument(documentId),
    });
    const document = await this.prisma.storedDocument.findUnique({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException(PtBrMessages.admin.documentNotFound);
    }

    await this.documentStorage.remove(document.objectKey);
    await this.prisma.storedDocument.delete({
      where: { id: documentId },
    });

    return { message: PtBrMessages.admin.documentRemoved };
  }

  async downloadDocument(documentId: string) {
    ApiLogger.info({
      context: 'AdminService',
      message: PtBrMessages.logs.admin.downloadingDocument(documentId),
    });
    const document = await this.prisma.storedDocument.findUnique({
      where: { id: documentId },
    });
    if (!document) {
      throw new NotFoundException(PtBrMessages.admin.documentNotFound);
    }

    const file = await this.documentStorage.download(document.objectKey);
    const decrypted = await this.fileCryptoService.decrypt(file.content);

    return {
      fileName: document.fileName,
      mimeType: document.mimeType,
      contentBase64: decrypted.toString('base64'),
    };
  }

  private getPagination(page?: string, pageSize?: string) {
    const normalizedPage = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);
    const normalizedPageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(pageSize ?? '20', 10) || 20),
    );
    return {
      skip: (normalizedPage - 1) * normalizedPageSize,
      take: normalizedPageSize,
    };
  }
}
