import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AuditService } from '../../src/modules/audit/application/audit.service';
import type { ExecutionContext } from '@nestjs/common';
import type { AuthUser } from '../../src/modules/auth/domain/auth-user.type';
import { JwtAuthGuard } from '../../src/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/presentation/guards/roles.guard';
import { InvoicesQueryService } from '../../src/modules/invoices/application/invoices-query.service';
import { ProcessInvoiceExtractionUseCase } from '../../src/modules/invoices/application/process-invoice-extraction.use-case';
import { InvoicesController } from '../../src/modules/invoices/presentation/invoices.controller';
import { LLM_EXTRACTOR_TOKEN } from '../../src/modules/llm/llm-extractor.interface';
import { FileCryptoService } from '../../src/modules/storage/application/file-crypto.service';
import { DOCUMENT_STORAGE_TOKEN } from '../../src/modules/storage/domain/document-storage.port';
import { PrismaService } from '../../src/shared/prisma/prisma.service';

describe('Invoices extract (integration)', () => {
  let app: INestApplication;

  const extraction = {
    numeroCliente: '7204076116',
    mesReferencia: 'JAN/2024',
    itensFatura: {
      energiaEletrica: { quantidadeKwh: 50, valorRs: 47.75 },
      energiaSceeSemIcms: { quantidadeKwh: 456, valorRs: 232.42 },
      energiaCompensadaGdi: { quantidadeKwh: 456, valorRs: -222.22 },
      contribIlumPublicaMunicipal: { valorRs: 49.43 },
    },
  };

  const mockUser: AuthUser = {
    sub: 'user_1',
    email: 'user@test.local',
    username: 'user',
    role: 'USER',
  };

  const txMock = {
    invoice: { create: jest.fn().mockResolvedValue({ id: 'inv_1' }) },
    invoiceMetrics: { create: jest.fn().mockResolvedValue({ id: 'met_1' }) },
    storedDocument: { create: jest.fn().mockResolvedValue({ id: 'doc_1' }) },
  };

  const prismaMock = {
    invoice: { findMany: jest.fn().mockResolvedValue([]) },
    storedDocument: { findMany: jest.fn().mockResolvedValue([]) },
    $transaction: jest.fn(
      async <T>(callback: (tx: typeof txMock) => Promise<T> | T): Promise<T> =>
        callback(txMock),
    ),
  };

  const llmMock = {
    extractInvoiceData: jest.fn().mockResolvedValue(extraction),
  };

  const storageMock = {
    upload: jest.fn().mockResolvedValue(undefined),
    download: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  const cryptoMock = {
    encrypt: jest.fn().mockResolvedValue(Buffer.from('encrypted')),
    decrypt: jest.fn(),
    checksum: jest.fn().mockReturnValue('sha256'),
  };

  const auditMock = {
    write: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        ProcessInvoiceExtractionUseCase,
        InvoicesQueryService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: LLM_EXTRACTOR_TOKEN, useValue: llmMock },
        { provide: DOCUMENT_STORAGE_TOKEN, useValue: storageMock },
        { provide: FileCryptoService, useValue: cryptoMock },
        { provide: AuditService, useValue: auditMock },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const map: Record<string, unknown> = {
                PDF_MAX_FILE_SIZE_MB: 50,
                S3_BUCKET: 'energy-bills',
                OPEN_SOURCE_IA: 'true',
                LLM_PROVIDER: 'ollama',
              };
              return map[key];
            },
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const httpRequest = ctx.switchToHttp().getRequest<{
            user?: AuthUser;
          }>();
          httpRequest.user = mockUser;
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve processar extração com upload de PDF', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server)
      .post('/invoices/extract')
      .attach('file', Buffer.from('%PDF-1.4 test'), {
        filename: 'fatura.pdf',
        contentType: 'application/pdf',
      });
    const body = response.body as { invoiceId: string; documentId: string };

    expect(response.status).toBe(201);
    expect(body.invoiceId).toBe('inv_1');
    expect(body.documentId).toBe('doc_1');
    expect(llmMock.extractInvoiceData).toHaveBeenCalledTimes(1);
    expect(storageMock.upload).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 400 quando arquivo não for enviado', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).post('/invoices/extract');
    expect(response.status).toBe(400);
  });
});
