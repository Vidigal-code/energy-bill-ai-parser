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

type ClaudeExtractorConfig = {
  apiKey: string;
  model: string;
  baseUrl: string;
  extractionReference: InvoiceExtractionReference;
  extractionPrompt: string;
  extractionContext: string;
};

export class ClaudeExtractor implements ILlmExtractor {
  constructor(private readonly config: ClaudeExtractorConfig) {}

  async extractInvoiceData(
    input: ExtractInvoiceInput,
  ): Promise<InvoiceExtraction> {
    const prompt = buildExtractionInstructions({
      extractionPrompt: this.config.extractionPrompt,
      extractionReference: this.config.extractionReference,
    });
    const userContext = buildExtractionContext({
      extractionContext: this.config.extractionContext,
      fileName: input.fileName,
    });

    const response = await fetch(`${this.config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: 2048,
        system: prompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: input.mimeType,
                  data: input.pdfBuffer.toString('base64'),
                },
              },
              {
                type: 'text',
                text: userContext,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      const requestFailedMessage = PtBrMessages.llm.requestFailed('claude');
      ApiLogger.logError({
        path: 'claude',
        method: 'POST',
        statusCode: response.status,
        message: body || requestFailedMessage,
      });
      throw new BadGatewayException(requestFailedMessage);
    }

    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const textContent = payload.content?.find(
      (part) => part.type === 'text',
    )?.text;
    if (!textContent) {
      const emptyResponseMessage = PtBrMessages.llm.emptyResponse('claude');
      ApiLogger.logError({
        path: 'claude',
        method: 'POST',
        statusCode: 502,
        message: emptyResponseMessage,
      });
      throw new BadGatewayException(emptyResponseMessage);
    }

    return parseInvoiceExtractionFromText(textContent);
  }
}
