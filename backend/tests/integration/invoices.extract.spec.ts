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
    'Nº DO CLIENTE': '7204076116',
    'Mês de referência': 'JAN/2024',
    'Energia Elétrica': { 'Quantidade (kWh)': 50, 'Valor (R$)': 47.75 },
    'Energia SCEEE s/ICMS': { 'Quantidade (kWh)': 456, 'Valor (R$)': 232.42 },
    'Energia compensada GD I': {
      'Quantidade (kWh)': 456,
      'Valor (R$)': -222.22,
    },
    'Contrib Ilum Publica Municipal': { 'Valor (R$)': 49.43 },
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
    invoiceMetrics: {
      aggregate: jest.fn().mockResolvedValue({
        _sum: {
          consumoEnergiaEletricaKwh: 506,
          energiaCompensadaKwh: 456,
          valorTotalSemGdRs: 329.6,
          economiaGdRs: -222.22,
        },
      }),
    },
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

  beforeEach(() => {
    jest.clearAllMocks();
    llmMock.extractInvoiceData.mockResolvedValue(extraction);
    prismaMock.invoice.findMany.mockResolvedValue([]);
    prismaMock.invoiceMetrics.aggregate.mockResolvedValue({
      _sum: {
        consumoEnergiaEletricaKwh: 506,
        energiaCompensadaKwh: 456,
        valorTotalSemGdRs: 329.6,
        economiaGdRs: -222.22,
      },
    });
  });

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
                PDF_MAX_FILE_SIZE_MB: 1,
                S3_BUCKET: 'energy-bills',
                OPEN_SOURCE_IA: 'false',
                LLM_PROVIDER: 'gemini',
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

  it('deve retornar 415 quando arquivo não for PDF', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server)
      .post('/invoices/extract')
      .attach('file', Buffer.from('plain-text'), {
        filename: 'nota.txt',
        contentType: 'text/plain',
      });

    expect(response.status).toBe(415);
  });

  it('deve retornar 413 quando PDF exceder limite configurado', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const payload = Buffer.alloc(2 * 1024 * 1024, 'a');
    const response = await request(server)
      .post('/invoices/extract')
      .attach('file', payload, {
        filename: 'fatura-grande.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(413);
  });

  it('deve registrar erro e remover arquivo quando LLM falhar', async () => {
    llmMock.extractInvoiceData.mockRejectedValueOnce(
      new Error('LLM indisponivel'),
    );

    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server)
      .post('/invoices/extract')
      .attach('file', Buffer.from('%PDF-1.4 fail-test'), {
        filename: 'fatura-falha.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(500);
    expect(storageMock.upload).toHaveBeenCalledTimes(1);
    expect(storageMock.remove).toHaveBeenCalledTimes(1);
    expect(auditMock.write).toHaveBeenCalledTimes(1);
  });

  it('deve listar faturas filtrando por periodo', async () => {
    prismaMock.invoice.findMany.mockResolvedValueOnce([
      {
        id: 'inv_jan',
        fileName: 'jan.pdf',
        numeroCliente: '7204076116',
        mesReferencia: 'JAN/2024',
        createdAt: new Date().toISOString(),
        metrics: {
          consumoEnergiaEletricaKwh: 506,
          energiaCompensadaKwh: 456,
          valorTotalSemGdRs: 329.6,
          economiaGdRs: -222.22,
        },
      },
      {
        id: 'inv_fev',
        fileName: 'fev.pdf',
        numeroCliente: '7204076116',
        mesReferencia: 'FEV/2024',
        createdAt: new Date().toISOString(),
        metrics: {
          consumoEnergiaEletricaKwh: 400,
          energiaCompensadaKwh: 300,
          valorTotalSemGdRs: 200,
          economiaGdRs: -100,
        },
      },
    ]);

    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get(
      '/invoices?numeroCliente=7204076116&periodoInicio=fev/2024&periodoFim=fev/2024',
    );
    const body = response.body as Array<{ mesReferencia?: string }>;

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]?.mesReferencia).toBe('FEV/2024');
  });

  it('deve retornar 400 quando periodoInicio for maior que periodoFim', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get(
      '/invoices?periodoInicio=mar/2024&periodoFim=jan/2024',
    );

    expect(response.status).toBe(400);
  });

  it('deve encaminhar pagina e pageSize para consulta paginada', async () => {
    prismaMock.invoice.findMany.mockResolvedValueOnce([
      {
        id: 'inv_1',
        fileName: 'fatura-1.pdf',
        numeroCliente: '7204076116',
        mesReferencia: 'JAN/2024',
        createdAt: new Date().toISOString(),
        metrics: undefined,
      },
      {
        id: 'inv_2',
        fileName: 'fatura-2.pdf',
        numeroCliente: '7204076116',
        mesReferencia: 'FEV/2024',
        createdAt: new Date().toISOString(),
        metrics: undefined,
      },
      {
        id: 'inv_3',
        fileName: 'fatura-3.pdf',
        numeroCliente: '7204076116',
        mesReferencia: 'MAR/2024',
        createdAt: new Date().toISOString(),
        metrics: undefined,
      },
    ]);

    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get('/invoices?page=2&pageSize=1');

    expect(response.status).toBe(200);
    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1,
        take: 1,
      }),
    );
  });

  it('deve retornar dashboard consolidado', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get(
      '/invoices/dashboard/consolidated',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      consumoEnergiaEletricaKwh: 506,
      energiaCompensadaKwh: 456,
      valorTotalSemGdRs: 329.6,
      economiaGdRs: -222.22,
    });
  });
});
