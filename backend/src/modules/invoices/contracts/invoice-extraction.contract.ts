import { z } from 'zod';

const numericField = z.number().finite();

export const invoiceExtractionSchema = z.object({
  numeroCliente: z.string().min(1),
  mesReferencia: z.string().min(1),
  itensFatura: z.object({
    energiaEletrica: z.object({
      quantidadeKwh: numericField,
      valorRs: numericField,
    }),
    energiaSceeSemIcms: z.object({
      quantidadeKwh: numericField,
      valorRs: numericField,
    }),
    energiaCompensadaGdi: z.object({
      quantidadeKwh: numericField,
      valorRs: numericField,
    }),
    contribIlumPublicaMunicipal: z.object({
      valorRs: numericField,
    }),
  }),
});

export type InvoiceExtraction = z.infer<typeof invoiceExtractionSchema>;

export type InvoiceComputedMetrics = {
  consumoEnergiaEletricaKwh: number;
  energiaCompensadaKwh: number;
  valorTotalSemGdRs: number;
  economiaGdRs: number;
};

export const INVOICE_EXTRACTION_REFERENCE = {
  requiredFields: [
    'numeroCliente',
    'mesReferencia',
    'itensFatura.energiaEletrica.quantidadeKwh',
    'itensFatura.energiaEletrica.valorRs',
    'itensFatura.energiaSceeSemIcms.quantidadeKwh',
    'itensFatura.energiaSceeSemIcms.valorRs',
    'itensFatura.energiaCompensadaGdi.quantidadeKwh',
    'itensFatura.energiaCompensadaGdi.valorRs',
    'itensFatura.contribIlumPublicaMunicipal.valorRs',
  ],
  businessRules: {
    consumoEnergiaEletricaKwh:
      'energiaEletrica.quantidadeKwh + energiaSceeSemIcms.quantidadeKwh',
    energiaCompensadaKwh: 'energiaCompensadaGdi.quantidadeKwh',
    valorTotalSemGdRs:
      'energiaEletrica.valorRs + energiaSceeSemIcms.valorRs + contribIlumPublicaMunicipal.valorRs',
    economiaGdRs: 'energiaCompensadaGdi.valorRs',
  },
} as const;

export const INVOICE_EXTRACTION_PROMPT = `
Você é um extrator de dados de fatura de energia. Retorne apenas JSON válido.
Não invente valores. Se um campo não existir no documento, retorne 0 para campos numéricos e string vazia para texto.

Campos obrigatórios:
- numeroCliente
- mesReferencia (ex.: SET/2024)
- itensFatura.energiaEletrica.quantidadeKwh
- itensFatura.energiaEletrica.valorRs
- itensFatura.energiaSceeSemIcms.quantidadeKwh
- itensFatura.energiaSceeSemIcms.valorRs
- itensFatura.energiaCompensadaGdi.quantidadeKwh
- itensFatura.energiaCompensadaGdi.valorRs
- itensFatura.contribIlumPublicaMunicipal.valorRs
`.trim();

export function computeInvoiceMetrics(
  extraction: InvoiceExtraction,
): InvoiceComputedMetrics {
  const consumoEnergiaEletricaKwh =
    extraction.itensFatura.energiaEletrica.quantidadeKwh +
    extraction.itensFatura.energiaSceeSemIcms.quantidadeKwh;

  const energiaCompensadaKwh =
    extraction.itensFatura.energiaCompensadaGdi.quantidadeKwh;

  const valorTotalSemGdRs =
    extraction.itensFatura.energiaEletrica.valorRs +
    extraction.itensFatura.energiaSceeSemIcms.valorRs +
    extraction.itensFatura.contribIlumPublicaMunicipal.valorRs;

  const economiaGdRs = extraction.itensFatura.energiaCompensadaGdi.valorRs;

  return {
    consumoEnergiaEletricaKwh,
    energiaCompensadaKwh,
    valorTotalSemGdRs,
    economiaGdRs,
  };
}
