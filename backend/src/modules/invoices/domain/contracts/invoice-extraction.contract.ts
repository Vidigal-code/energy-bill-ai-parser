import { z } from 'zod';

const numericField = z.number().finite();

export const invoiceExtractionSchema = z.object({
  'Nº DO CLIENTE': z.string().min(1),
  'Mês de referência': z.string().min(1),
  'Energia Elétrica': z.object({
    'Quantidade (kWh)': numericField,
    'Valor (R$)': numericField,
  }),
  'Energia SCEEE s/ICMS': z.object({
    'Quantidade (kWh)': numericField,
    'Valor (R$)': numericField,
  }),
  'Energia compensada GD I': z.object({
    'Quantidade (kWh)': numericField,
    'Valor (R$)': numericField,
  }),
  'Contrib Ilum Publica Municipal': z.object({
    'Valor (R$)': numericField,
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
    '"Nº DO CLIENTE" (Ex: 7202210726)',
    '"Mês de referência" (Ex: SET/2024)',
    "'Energia Elétrica' - Quantidade (kWh) e Valor (R$)",
    "'Energia SCEEE s/ICMS' - Quantidade (kWh) e Valor (R$)",
    "'Energia compensada GD I' - Quantidade (kWh) e Valor (R$)",
    "'Contrib Ilum Publica Municipal' - Valor (R$)"
  ],
  businessRules: {
    consumoEnergiaEletricaKwh:
      "'Energia Elétrica' Quantidade (kWh) + 'Energia SCEEE s/ICMS' Quantidade (kWh)",
    energiaCompensadaKwh: "'Energia compensada GD I' Quantidade (kWh)",
    valorTotalSemGdRs:
      "'Energia Elétrica' Valor (R$) + 'Energia SCEEE s/ICMS' Valor (R$) + 'Contrib Ilum Publica Municipal' Valor (R$)",
    economiaGdRs: "'Energia compensada GD I' Valor (R$)",
  },
};

export const DEFAULT_INVOICE_EXTRACTION_PROMPT = `
Você é um extrator de dados de fatura de energia elétrica. Seu objetivo é realizar a análise multimodal do documento PDF fornecido e extrair os dados estruturados.
Retorne um objeto JSON estrito (JSON Mode/Structured Output) contendo EXATAMENTE as informações abaixo (respeite as chaves textualmente):

- "Nº DO CLIENTE"
- "Mês de referência"
- "Energia Elétrica": com os campos "Quantidade (kWh)" e "Valor (R$)"
- "Energia SCEEE s/ICMS": com os campos "Quantidade (kWh)" e "Valor (R$)"
- "Energia compensada GD I": com os campos "Quantidade (kWh)" e "Valor (R$)"
- "Contrib Ilum Publica Municipal": com o campo "Valor (R$)"

Não invente valores. Se um campo não existir no documento, retorne 0 para campos numéricos e string vazia para texto.
O JSON retornado deve ter esta exata estrutura e nomenclaturas.
`.trim();

export const DEFAULT_INVOICE_EXTRACTION_CONTEXT =
  'Analise o arquivo PDF "{{fileName}}" anexado e retorne SOMENTE um JSON válido.';

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
    extraction['Energia Elétrica']['Quantidade (kWh)'] +
    extraction['Energia SCEEE s/ICMS']['Quantidade (kWh)'];

  const energiaCompensadaKwh =
    extraction['Energia compensada GD I']['Quantidade (kWh)'];

  const valorTotalSemGdRs =
    extraction['Energia Elétrica']['Valor (R$)'] +
    extraction['Energia SCEEE s/ICMS']['Valor (R$)'] +
    extraction['Contrib Ilum Publica Municipal']['Valor (R$)'];

  const economiaGdRs = extraction['Energia compensada GD I']['Valor (R$)'];

  return {
    consumoEnergiaEletricaKwh,
    energiaCompensadaKwh,
    valorTotalSemGdRs,
    economiaGdRs,
  };
}
