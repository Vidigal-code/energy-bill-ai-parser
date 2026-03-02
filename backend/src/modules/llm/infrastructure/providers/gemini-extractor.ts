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

type GeminiExtractorConfig = {
  apiKey: string;
  model: string;
  baseUrl: string;
  extractionReference: InvoiceExtractionReference;
  extractionPrompt: string;
  extractionContext: string;
};

export class GeminiExtractor implements ILlmExtractor {
  constructor(private readonly config: GeminiExtractorConfig) {}

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

    const response = await fetch(
      `${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationConfig: {
            responseMimeType: 'application/json',
          },
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${prompt}\n\n${userContext}` },
                {
                  inlineData: {
                    mimeType: input.mimeType,
                    data: input.pdfBuffer.toString('base64'),
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      const requestFailedMessage = PtBrMessages.llm.requestFailed('gemini');
      ApiLogger.logError({
        path: 'gemini',
        method: 'POST',
        statusCode: response.status,
        message: body || requestFailedMessage,
      });
      throw new BadGatewayException(requestFailedMessage);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      const emptyResponseMessage = PtBrMessages.llm.emptyResponse('gemini');
      ApiLogger.logError({
        path: 'gemini',
        method: 'POST',
        statusCode: 502,
        message: emptyResponseMessage,
      });
      throw new BadGatewayException(emptyResponseMessage);
    }

    return parseInvoiceExtractionFromText(content);
  }
}
