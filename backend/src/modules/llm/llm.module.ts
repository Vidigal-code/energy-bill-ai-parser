import { Module, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ILlmExtractor,
  LLM_EXTRACTOR_TOKEN,
  LlmProvider,
} from './llm-extractor.interface';
import {
  resolveInvoiceExtractionContext,
  resolveInvoiceExtractionPrompt,
  resolveInvoiceExtractionReference,
} from '../invoices/domain/contracts/invoice-extraction.contract';
import { ApiLogger } from '../../shared/logging/api-logger';
import { PtBrMessages } from '../../shared/messages/pt-br.messages';
import { ClaudeExtractor } from './infrastructure/providers/claude-extractor';
import { GeminiExtractor } from './infrastructure/providers/gemini-extractor';
import { OllamaExtractor } from './infrastructure/providers/ollama-extractor';
import { OpenAiExtractor } from './infrastructure/providers/openai-extractor';

function getRequiredConfigValue(
  configService: ConfigService,
  key: string,
  provider: LlmProvider,
): string {
  const value = configService.get<string>(key);
  if (!value) {
    const message = PtBrMessages.llm.missingConfiguration(key, provider);
    ApiLogger.logError({
      path: 'llm-module',
      method: 'SYSTEM',
      statusCode: 503,
      message,
    });
    throw new ServiceUnavailableException(message);
  }

  return value;
}

@Module({
  providers: [
    {
      provide: LLM_EXTRACTOR_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ILlmExtractor => {
        const openSourceIa =
          configService.get<string>('OPEN_SOURCE_IA')?.toLowerCase() === 'true';
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
        const extractionContext = resolveInvoiceExtractionContext(
          configService.get<string>('INVOICE_EXTRACTION_CONTEXT'),
        );

        ApiLogger.info({
          context: 'LLM',
          message: PtBrMessages.logs.llm.providerSelected(
            provider,
            rollbackOnInvoiceFailure,
          ),
        });

        if (provider === 'ollama') {
          return new OllamaExtractor({
            baseUrl:
              configService.get<string>('OLLAMA_BASE_URL') ??
              'http://localhost:11434',
            model:
              configService.get<string>('OLLAMA_MODEL') ?? 'llama3.2-vision',
            extractionReference,
            extractionPrompt,
            extractionContext,
          });
        }

        if (provider === 'openai') {
          return new OpenAiExtractor({
            apiKey: getRequiredConfigValue(
              configService,
              'OPENAI_API_KEY',
              provider,
            ),
            model: configService.get<string>('OPENAI_MODEL') ?? 'gpt-4.1-mini',
            baseUrl:
              configService.get<string>('OPENAI_BASE_URL') ??
              'https://api.openai.com/v1',
            extractionReference,
            extractionPrompt,
            extractionContext,
          });
        }

        if (provider === 'gemini' || provider === 'google') {
          return new GeminiExtractor({
            apiKey: getRequiredConfigValue(
              configService,
              'GEMINI_API_KEY',
              provider,
            ),
            model:
              configService.get<string>('GEMINI_MODEL') ?? 'gemini-1.5-flash',
            baseUrl:
              configService.get<string>('GEMINI_BASE_URL') ??
              'https://generativelanguage.googleapis.com/v1beta',
            extractionReference,
            extractionPrompt,
            extractionContext,
          });
        }

        if (provider === 'claude') {
          return new ClaudeExtractor({
            apiKey: getRequiredConfigValue(
              configService,
              'ANTHROPIC_API_KEY',
              provider,
            ),
            model:
              configService.get<string>('ANTHROPIC_MODEL') ??
              'claude-3-5-sonnet-latest',
            baseUrl:
              configService.get<string>('ANTHROPIC_BASE_URL') ??
              'https://api.anthropic.com/v1',
            extractionReference,
            extractionPrompt,
            extractionContext,
          });
        }

        ApiLogger.logError({
          path: 'llm-module',
          method: 'SYSTEM',
          statusCode: 503,
          message: PtBrMessages.llm.unsupportedProvider,
        });
        throw new ServiceUnavailableException(
          PtBrMessages.llm.unsupportedProvider,
        );
      },
    },
  ],
  exports: [LLM_EXTRACTOR_TOKEN],
})
export class LlmModule {}
