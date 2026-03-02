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

type OpenAiExtractorConfig = {
  apiKey: string;
  model: string;
  baseUrl: string;
  extractionReference: InvoiceExtractionReference;
  extractionPrompt: string;
  extractionContext: string;
};

export class OpenAiExtractor implements ILlmExtractor {
  constructor(private readonly config: OpenAiExtractorConfig) {}

  async extractInvoiceData(
    input: ExtractInvoiceInput,
  ): Promise<InvoiceExtraction> {
    ApiLogger.warning({
      context: 'OpenAiExtractor',
      message:
        'Provider OpenAI esta operando em modo de contexto textual com PDF em base64. Para requisito estrito de PDF nativo, utilize Gemini ou Claude.',
    });
    const prompt = buildExtractionInstructions({
      extractionPrompt: this.config.extractionPrompt,
      extractionReference: this.config.extractionReference,
    });
    const userContext = buildExtractionContext({
      extractionContext: this.config.extractionContext,
      fileName: input.fileName,
      includeBase64Data: true,
      pdfBase64: input.pdfBuffer.toString('base64'),
    });

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: prompt },
          {
            role: 'user',
            content: userContext,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      const requestFailedMessage = PtBrMessages.llm.requestFailed('openai');
      ApiLogger.logError({
        path: 'openai',
        method: 'POST',
        statusCode: response.status,
        message: body || requestFailedMessage,
      });
      throw new BadGatewayException(requestFailedMessage);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      const emptyResponseMessage = PtBrMessages.llm.emptyResponse('openai');
      ApiLogger.logError({
        path: 'openai',
        method: 'POST',
        statusCode: 502,
        message: emptyResponseMessage,
      });
      throw new BadGatewayException(emptyResponseMessage);
    }

    return parseInvoiceExtractionFromText(content);
  }
}
