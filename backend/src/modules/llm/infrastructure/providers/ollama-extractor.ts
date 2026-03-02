import { BadGatewayException } from '@nestjs/common';
import {
  InvoiceExtraction,
  InvoiceExtractionReference,
} from '../../../invoices/domain/contracts/invoice-extraction.contract';
import { ApiLogger } from '../../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../../shared/messages/pt-br.messages';
import {
  buildExtractionContext,
  buildExtractionInstructions,
} from '../../application/extraction-instructions';
import { parseInvoiceExtractionFromText } from '../../application/extraction-response.parser';
import {
  ExtractInvoiceInput,
  ILlmExtractor,
} from '../../llm-extractor.interface';
import { convertPdfToImageBase64 } from '../../application/pdf-to-image';

type OllamaExtractorConfig = {
  baseUrl: string;
  model: string;
  extractionReference: InvoiceExtractionReference;
  extractionPrompt: string;
  extractionContext: string;
};

export class OllamaExtractor implements ILlmExtractor {
  constructor(private readonly config: OllamaExtractorConfig) {}

  async extractInvoiceData(
    input: ExtractInvoiceInput,
  ): Promise<InvoiceExtraction> {
    const prompt = buildExtractionInstructions({
      extractionPrompt: this.config.extractionPrompt,
      extractionReference: this.config.extractionReference,
    });

    const userPrompt = buildExtractionContext({
      extractionContext: this.config.extractionContext,
      fileName: input.fileName,
      includeBase64Data: false,
    });

    const base64Image = await convertPdfToImageBase64(input.pdfBuffer);

    const response = await fetch(`${this.config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        stream: false,
        format: 'json',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userPrompt, images: [base64Image] },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      const requestFailedMessage = PtBrMessages.llm.requestFailed('ollama');
      ApiLogger.logError({
        path: 'ollama',
        method: 'POST',
        statusCode: response.status,
        message: body || requestFailedMessage,
      });
      throw new BadGatewayException(requestFailedMessage);
    }

    const payload = (await response.json()) as {
      message?: { content?: string };
    };
    const content = payload.message?.content;
    if (!content) {
      const emptyResponseMessage = PtBrMessages.llm.emptyResponse('ollama');
      ApiLogger.logError({
        path: 'ollama',
        method: 'POST',
        statusCode: 502,
        message: emptyResponseMessage,
      });
      throw new BadGatewayException(emptyResponseMessage);
    }

    return parseInvoiceExtractionFromText(content);
  }
}
