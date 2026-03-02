import {
  computeInvoiceMetrics,
  DEFAULT_INVOICE_EXTRACTION_PROMPT,
  DEFAULT_INVOICE_EXTRACTION_REFERENCE,
  resolveInvoiceExtractionPrompt,
  resolveInvoiceExtractionReference,
} from '../../src/modules/invoices/domain/contracts/invoice-extraction.contract';

describe('invoice-extraction.contract', () => {
  it('deve calcular métricas corretamente', () => {
    const metrics = computeInvoiceMetrics({
      numeroCliente: '7204076116',
      mesReferencia: 'JAN/2024',
      itensFatura: {
        energiaEletrica: { quantidadeKwh: 50, valorRs: 47.75 },
        energiaSceeSemIcms: { quantidadeKwh: 456, valorRs: 232.42 },
        energiaCompensadaGdi: { quantidadeKwh: 456, valorRs: -222.22 },
        contribIlumPublicaMunicipal: { valorRs: 49.43 },
      },
    });

    expect(metrics.consumoEnergiaEletricaKwh).toBe(506);
    expect(metrics.energiaCompensadaKwh).toBe(456);
    expect(metrics.valorTotalSemGdRs).toBeCloseTo(329.6, 6);
    expect(metrics.economiaGdRs).toBe(-222.22);
  });

  it('deve usar referência default quando referência é inválida', () => {
    const resolved = resolveInvoiceExtractionReference('{invalid json');
    expect(resolved).toEqual(DEFAULT_INVOICE_EXTRACTION_REFERENCE);
  });

  it('deve usar prompt default quando prompt vazio', () => {
    expect(resolveInvoiceExtractionPrompt('   ')).toBe(
      DEFAULT_INVOICE_EXTRACTION_PROMPT,
    );
  });
});
