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
  private readonly fallbackModels = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-001',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
  ];

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

    let lastErrorBody = '';
    let lastStatusCode = 502;

    for (const model of this.resolveModelAttempts()) {
      const response = await fetch(
        `${this.config.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`,
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
        lastStatusCode = response.status;
        lastErrorBody = await response.text();

        if (response.status === 404) {
          ApiLogger.warning({
            context: 'gemini',
            message: `Modelo ${model} indisponivel para generateContent. Tentando fallback.`,
          });
          continue;
        }

        const requestFailedMessage = PtBrMessages.llm.requestFailed('gemini');
        ApiLogger.logError({
          path: 'gemini',
          method: 'POST',
          statusCode: response.status,
          message: lastErrorBody || requestFailedMessage,
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

    const requestFailedMessage = PtBrMessages.llm.requestFailed('gemini');
    ApiLogger.logError({
      path: 'gemini',
      method: 'POST',
      statusCode: lastStatusCode,
      message: lastErrorBody || requestFailedMessage,
    });
    throw new BadGatewayException(requestFailedMessage);
  }

  private resolveModelAttempts(): string[] {
    const configured = this.normalizeModel(this.config.model);
    const attempts = [configured, ...this.fallbackModels];
    return [...new Set(attempts)];
  }

  private normalizeModel(model: string): string {
    if (model.startsWith('models/')) {
      return model.replace(/^models\//, '');
    }
    return model;
  }
}
