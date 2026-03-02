import { InvoiceExtractionReference } from '../../invoices/domain/contracts/invoice-extraction.contract';

type BuildExtractionInstructionsInput = {
  extractionPrompt: string;
  extractionReference: InvoiceExtractionReference;
};

type BuildExtractionContextInput = {
  extractionContext: string;
  fileName: string;
  includeBase64Data?: boolean;
  pdfBase64?: string;
};

export function buildExtractionInstructions(
  input: BuildExtractionInstructionsInput,
): string {
  const referenceJson = JSON.stringify(input.extractionReference, null, 2);
  return `
${input.extractionPrompt}

Use esta referência de campos e regras:
${referenceJson}

Regras obrigatórias de saída:
- Retorne apenas JSON puro (sem markdown e sem comentários).
- Respeite exatamente os nomes dos campos.
- Use números para kWh e valores monetários.
`.trim();
}

export function buildExtractionContext(
  input: BuildExtractionContextInput,
): string {
  const template = input.extractionContext.replaceAll(
    '{{fileName}}',
    input.fileName,
  );
  if (!input.includeBase64Data) {
    return template;
  }

  const encodedPdf = input.pdfBase64 ?? '';
  return `${template}\n\nPDF_BASE64:\n${encodedPdf}`.trim();
}
