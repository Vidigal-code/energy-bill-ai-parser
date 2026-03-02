import { PrismaClient } from '@prisma/client';

const shouldRunDbIntegration =
  process.env.RUN_DB_INTEGRATION === 'true' &&
  Boolean(process.env.DATABASE_URL);

const describeDb = shouldRunDbIntegration ? describe : describe.skip;

describeDb('Prisma persistence (integration)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.invoiceMetrics.deleteMany();
    await prisma.storedDocument.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('deve inserir e consultar usuario e fatura no banco real', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'db.integration@local.test',
        username: 'db_integration_user',
        passwordHash: 'hash',
        role: 'USER',
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        uploaderUserId: user.id,
        fileName: 'fatura.pdf',
        status: 'SUCCESS',
        numeroCliente: '7204076116',
        mesReferencia: 'JAN/2024',
        energiaEletricaQuantidadeKwh: 50,
        energiaEletricaValorRs: 47.75,
        energiaSceeSemIcmsQuantidadeKwh: 456,
        energiaSceeSemIcmsValorRs: 232.42,
        energiaCompensadaGdiQuantidadeKwh: 456,
        energiaCompensadaGdiValorRs: -222.22,
        contribIlumPublicaMunicipalValorRs: 49.43,
        extractionProvider: 'ollama',
        rawExtractionJson: { source: 'db-integration-test' },
      },
    });

    await prisma.invoiceMetrics.create({
      data: {
        invoiceId: invoice.id,
        consumoEnergiaEletricaKwh: 506,
        energiaCompensadaKwh: 456,
        valorTotalSemGdRs: 329.6,
        economiaGdRs: -222.22,
      },
    });

    const found = await prisma.invoice.findMany({
      where: { id: invoice.id },
      include: { metrics: true, uploader: true },
    });

    expect(found).toHaveLength(1);
    expect(found[0]?.uploader.email).toBe('db.integration@local.test');
    expect(Number(found[0]?.metrics?.consumoEnergiaEletricaKwh ?? 0)).toBe(506);
    expect(found[0]?.numeroCliente).toBe('7204076116');
  });
});
