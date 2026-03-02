import { BadGatewayException } from '@nestjs/common';
import {
  InvoiceExtraction,
  invoiceExtractionSchema,
} from '../../invoices/domain/contracts/invoice-extraction.contract';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';

function extractJsonFromMarkdown(raw: string): string {
  const fencedJsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fencedJsonMatch?.[1]) {
    return fencedJsonMatch[1].trim();
  }

  const fencedMatch = raw.match(/```\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return raw.trim();
}

function extractJsonByBraces(raw: string): string {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end <= start) {
    return raw;
  }
  return raw.slice(start, end + 1);
}

export function parseInvoiceExtractionFromText(
  rawText: string,
): InvoiceExtraction {
  const sanitized = extractJsonFromMarkdown(rawText);
  const jsonCandidate = extractJsonByBraces(sanitized);

  try {
    const parsed = JSON.parse(jsonCandidate) as unknown;
    return invoiceExtractionSchema.parse(parsed);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : PtBrMessages.common.unknownError;
    ApiLogger.logError({
      path: 'llm-parser',
      method: 'SYSTEM',
      statusCode: 502,
      message,
    });
    throw new BadGatewayException(PtBrMessages.llm.invalidExtractionPayload);
  }
}
