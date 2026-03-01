import { InvoiceExtraction } from '../invoices/contracts/invoice-extraction.contract';

export type LlmProvider = 'ollama' | 'openai' | 'gemini' | 'claude';

export type ExtractInvoiceInput = {
  pdfBuffer: Buffer;
  mimeType: 'application/pdf';
  fileName: string;
};

export interface ILlmExtractor {
  extractInvoiceData(input: ExtractInvoiceInput): Promise<InvoiceExtraction>;
}

export const LLM_EXTRACTOR_TOKEN = Symbol('LLM_EXTRACTOR_TOKEN');
