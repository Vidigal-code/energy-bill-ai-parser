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
      'Nº DO CLIENTE': '7204076116',
      'Mês de referência': 'JAN/2024',
      'Energia Elétrica': { 'Quantidade (kWh)': 50, 'Valor (R$)': 47.75 },
      'Energia SCEEE s/ICMS': { 'Quantidade (kWh)': 456, 'Valor (R$)': 232.42 },
      'Energia compensada GD I': { 'Quantidade (kWh)': 456, 'Valor (R$)': -222.22 },
      'Contrib Ilum Publica Municipal': { 'Valor (R$)': 49.43 },
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
