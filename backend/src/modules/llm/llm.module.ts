import { Module, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ExtractInvoiceInput,
  ILlmExtractor,
  LLM_EXTRACTOR_TOKEN,
  LlmProvider,
} from './llm-extractor.interface';
import {
  InvoiceExtraction,
  InvoiceExtractionReference,
  resolveInvoiceExtractionPrompt,
  resolveInvoiceExtractionReference,
} from '../invoices/domain/contracts/invoice-extraction.contract';
import { ApiLogger } from '../../shared/logging/api-logger';

class NotImplementedExtractor implements ILlmExtractor {
  constructor(
    private readonly provider: LlmProvider,
    private readonly extractionReference: InvoiceExtractionReference,
    private readonly extractionPrompt: string,
    private readonly rollbackOnInvoiceFailure: boolean,
  ) {}

  extractInvoiceData(input: ExtractInvoiceInput): Promise<InvoiceExtraction> {
    // Placeholder provider until concrete adapters are implemented.
    void input;
    void this.extractionReference;
    void this.extractionPrompt;
    void this.rollbackOnInvoiceFailure;
    const message = `LLM extractor for provider "${this.provider}" is not implemented yet.`;
    ApiLogger.warning({
      context: 'LLM',
      message,
    });
    return Promise.reject(new NotImplementedException(message));
  }
}

@Module({
  providers: [
    {
      provide: LLM_EXTRACTOR_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ILlmExtractor => {
        const openSourceIa =
          configService.get<string>('OPEN_SOURCE_IA') === 'true';
        const provider = openSourceIa
          ? 'ollama'
          : (configService.get<LlmProvider>('LLM_PROVIDER') ?? 'openai');
        const rollbackOnInvoiceFailure =
          configService.get<string>('ROLLBACK_ON_INVOICE_FAILURE') !== 'false';
        const extractionReference = resolveInvoiceExtractionReference(
          configService.get<string>('INVOICE_EXTRACTION_REFERENCE'),
        );
        const extractionPrompt = resolveInvoiceExtractionPrompt(
          configService.get<string>('INVOICE_EXTRACTION_PROMPT'),
        );
        ApiLogger.info({
          context: 'LLM',
          message: `Provider selected: ${provider}. Rollback on extraction failure: ${rollbackOnInvoiceFailure}.`,
        });

        return new NotImplementedExtractor(
          provider,
          extractionReference,
          extractionPrompt,
          rollbackOnInvoiceFailure,
        );
      },
    },
  ],
  exports: [LLM_EXTRACTOR_TOKEN],
})
export class LlmModule {}
