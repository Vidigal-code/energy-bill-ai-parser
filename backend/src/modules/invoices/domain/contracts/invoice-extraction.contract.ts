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

export const invoiceExtractionReferenceSchema = z.object({
  requiredFields: z.array(z.string().min(1)).min(1),
  businessRules: z.object({
    consumoEnergiaEletricaKwh: z.string().min(1),
    energiaCompensadaKwh: z.string().min(1),
    valorTotalSemGdRs: z.string().min(1),
    economiaGdRs: z.string().min(1),
  }),
});

export type InvoiceExtractionReference = z.infer<
  typeof invoiceExtractionReferenceSchema
>;

export const DEFAULT_INVOICE_EXTRACTION_REFERENCE: InvoiceExtractionReference =
  {
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
  };

export const DEFAULT_INVOICE_EXTRACTION_PROMPT = `
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

export const DEFAULT_INVOICE_EXTRACTION_CONTEXT =
  'Analise o arquivo "{{fileName}}" e retorne somente JSON válido com os campos definidos em INVOICE_EXTRACTION_REFERENCE.';

export function resolveInvoiceExtractionReference(
  rawReference?: string,
): InvoiceExtractionReference {
  if (!rawReference) {
    return DEFAULT_INVOICE_EXTRACTION_REFERENCE;
  }

  try {
    const parsedReference = JSON.parse(rawReference) as unknown;
    return invoiceExtractionReferenceSchema.parse(parsedReference);
  } catch {
    return DEFAULT_INVOICE_EXTRACTION_REFERENCE;
  }
}

export function resolveInvoiceExtractionPrompt(rawPrompt?: string): string {
  const prompt = rawPrompt?.trim();
  if (!prompt) {
    return DEFAULT_INVOICE_EXTRACTION_PROMPT;
  }

  return prompt;
}

export function resolveInvoiceExtractionContext(rawContext?: string): string {
  const context = rawContext?.trim();
  if (!context) {
    return DEFAULT_INVOICE_EXTRACTION_CONTEXT;
  }

  return context;
}

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
