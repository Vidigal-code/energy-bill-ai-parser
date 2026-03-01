import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ExtractInvoiceInput,
  ILlmExtractor,
  LLM_EXTRACTOR_TOKEN,
  LlmProvider,
} from './llm-extractor.interface';
import {
  InvoiceExtraction,
  invoiceExtractionSchema,
} from '../invoices/contracts/invoice-extraction.contract';

class NotImplementedExtractor implements ILlmExtractor {
  constructor(private readonly provider: LlmProvider) {}

  async extractInvoiceData(_input: ExtractInvoiceInput): Promise<InvoiceExtraction> {
    throw new Error(
      `LLM extractor for provider "${this.provider}" is not implemented yet.`,
    );
  }
}

@Module({
  providers: [
    {
      provide: LLM_EXTRACTOR_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ILlmExtractor => {
        const openSourceIa = configService.get<string>('OPEN_SOURCE_IA') === 'true';
        const provider = openSourceIa
          ? 'ollama'
          : (configService.get<LlmProvider>('LLM_PROVIDER') ?? 'openai');
        invoiceExtractionSchema;
        return new NotImplementedExtractor(provider);
      },
    },
  ],
  exports: [LLM_EXTRACTOR_TOKEN],
})
export class LlmModule {}
