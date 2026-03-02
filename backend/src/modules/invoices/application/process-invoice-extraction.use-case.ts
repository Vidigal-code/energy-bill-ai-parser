import {
  Inject,
  Injectable,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AuditStatus, InvoiceStatus } from '@prisma/client';
import { computeInvoiceMetrics } from '../domain/contracts/invoice-extraction.contract';
import { LLM_EXTRACTOR_TOKEN } from '../../llm/llm-extractor.interface';
import type {
  ExtractInvoiceInput,
  ILlmExtractor,
} from '../../llm/llm-extractor.interface';
import { ApiLogger } from '../../../shared/logging/api-logger';
import {
  resolvePdfMaxFileSizeBytes,
  resolvePdfMaxFileSizeMb,
} from '../../../shared/config/pdf-upload.config';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { DOCUMENT_STORAGE_TOKEN } from '../../storage/domain/document-storage.port';
import { FileCryptoService } from '../../storage/application/file-crypto.service';
import { AuditService } from '../../audit/application/audit.service';
import type { DocumentStoragePort } from '../../storage/domain/document-storage.port';

type ProcessInvoiceExtractionInput = {
  actorUserId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  ip?: string;
  userAgent?: string;
};

@Injectable()
/**
 *
 * EN: Core invoice processing use-case orchestrating extraction, storage, persistence and auditing.
 *
 * PT: Caso de uso principal de processamento de fatura, orquestrando extracao, armazenamento, persistencia e auditoria.
 *
 * @params Extraction input with file payload and actor context.
 * @returns Persisted invoice response with computed metrics.
 */
export class ProcessInvoiceExtractionUseCase {
  constructor(
    @Inject(LLM_EXTRACTOR_TOKEN)
    private readonly llmExtractor: ILlmExtractor,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(DOCUMENT_STORAGE_TOKEN)
    private readonly documentStorage: DocumentStoragePort,
    private readonly fileCryptoService: FileCryptoService,
    private readonly auditService: AuditService,
  ) { }

  /**
   *
   * EN: Processes a PDF invoice, extracts data with LLM, persists transactionally and writes audit.
   *
   * PT: Processa uma fatura PDF, extrai dados com LLM, persiste em transacao e registra auditoria.
   *
   * @params input Request data with actor, file metadata and binary payload.
   * @returns Persisted identifiers, raw extraction payload and computed metrics.
   */
  async execute(input: ProcessInvoiceExtractionInput) {
    const maxFileSizeRaw = this.configService.get<string | number>(
      'PDF_MAX_FILE_SIZE_MB',
    );
    const maxFileSizeMb = resolvePdfMaxFileSizeMb(maxFileSizeRaw);
    const maxFileSizeBytes = resolvePdfMaxFileSizeBytes(maxFileSizeRaw);

    if (input.mimeType !== 'application/pdf') {
      const message = PtBrMessages.invoices.unsupportedFileType(input.mimeType);
      ApiLogger.logError({
        path: 'invoice-extraction',
        method: 'POST',
        statusCode: 415,
        message,
      });
      throw new UnsupportedMediaTypeException(
        PtBrMessages.invoices.onlyPdfSupported,
      );
    }

    if (input.buffer.length > maxFileSizeBytes) {
      const message = PtBrMessages.invoices.fileExceededMaxLimit(maxFileSizeMb);
      ApiLogger.logError({
        path: 'invoice-extraction',
        method: 'POST',
        statusCode: 413,
        message,
      });
      throw new PayloadTooLargeException(message);
    }

    ApiLogger.info({
      context: 'InvoiceExtraction',
      message: PtBrMessages.logs.invoices.processingFile(input.fileName),
    });

    const encryptedContent = await this.fileCryptoService.encrypt(input.buffer);
    const checksum = this.fileCryptoService.checksum(input.buffer);
    const objectKey = `${input.actorUserId}/${Date.now()}-${randomUUID()}.jwe`;
    let hasUploadedDocument = false;

    await this.documentStorage.upload({
      objectKey,
      content: encryptedContent,
      mimeType: 'application/jose',
    });
    hasUploadedDocument = true;

    const extractorInput: ExtractInvoiceInput = {
      fileName: input.fileName,
      mimeType: 'application/pdf',
      pdfBuffer: input.buffer,
    };

    try {
      const extraction =
        await this.llmExtractor.extractInvoiceData(extractorInput);
      const metrics = computeInvoiceMetrics(extraction);
      const provider = this.resolveProvider();

      const persisted = await this.prisma.$transaction(async (tx) => {
        const invoice = await tx.invoice.create({
          data: {
            uploaderUserId: input.actorUserId,
            fileName: input.fileName,
            status: InvoiceStatus.SUCCESS,
            numeroCliente: extraction['Nº DO CLIENTE'],
            mesReferencia: extraction['Mês de referência'],
            energiaEletricaQuantidadeKwh:
              extraction['Energia Elétrica']['Quantidade (kWh)'],
            energiaEletricaValorRs:
              extraction['Energia Elétrica']['Valor (R$)'],
            energiaSceeSemIcmsQuantidadeKwh:
              extraction['Energia SCEEE s/ICMS']['Quantidade (kWh)'],
            energiaSceeSemIcmsValorRs:
              extraction['Energia SCEEE s/ICMS']['Valor (R$)'],
            energiaCompensadaGdiQuantidadeKwh:
              extraction['Energia compensada GD I']['Quantidade (kWh)'],
            energiaCompensadaGdiValorRs:
              extraction['Energia compensada GD I']['Valor (R$)'],
            contribIlumPublicaMunicipalValorRs:
              extraction['Contrib Ilum Publica Municipal']['Valor (R$)'],
            extractionProvider: provider,
            rawExtractionJson: extraction,
          },
        });

        await tx.invoiceMetrics.create({
          data: {
            invoiceId: invoice.id,
            consumoEnergiaEletricaKwh: metrics.consumoEnergiaEletricaKwh,
            energiaCompensadaKwh: metrics.energiaCompensadaKwh,
            valorTotalSemGdRs: metrics.valorTotalSemGdRs,
            economiaGdRs: metrics.economiaGdRs,
          },
        });

        const storedDocument = await tx.storedDocument.create({
          data: {
            invoiceId: invoice.id,
            uploaderUserId: input.actorUserId,
            bucket:
              this.configService.get<string>('S3_BUCKET') ?? 'energy-bills',
            objectKey,
            fileName: input.fileName,
            mimeType: input.mimeType,
            sizeBytes: input.buffer.length,
            checksum,
          },
        });

        return { invoice, storedDocument };
      });

      await this.auditService.write({
        actorUserId: input.actorUserId,
        action: 'INVOICE_UPLOAD_PROCESS',
        resourceType: 'INVOICE',
        resourceId: persisted.invoice.id,
        status: AuditStatus.SUCCESS,
        message: PtBrMessages.invoices.invoiceProcessed,
        meta: {
          fileName: input.fileName,
          provider,
          documentId: persisted.storedDocument.id,
        },
        ip: input.ip,
        userAgent: input.userAgent,
      });

      return {
        invoiceId: persisted.invoice.id,
        documentId: persisted.storedDocument.id,
        extraction,
        metrics,
      };
    } catch (error) {
      if (hasUploadedDocument) {
        try {
          await this.documentStorage.remove(objectKey);
        } catch {
          ApiLogger.warning({
            context: 'InvoiceExtraction',
            message: PtBrMessages.invoices.failedRollbackFileRemoval,
          });
        }
      }

      await this.auditService.write({
        actorUserId: input.actorUserId,
        action: 'INVOICE_UPLOAD_PROCESS',
        resourceType: 'INVOICE',
        status: AuditStatus.ERROR,
        message: PtBrMessages.invoices.failedToProcessInvoice,
        meta: {
          fileName: input.fileName,
          error:
            error instanceof Error
              ? error.message
              : PtBrMessages.common.unknownError,
        },
        ip: input.ip,
        userAgent: input.userAgent,
      });

      throw error;
    }
  }

  /**
   *
   * EN: Resolves extraction provider based on environment strategy.
   *
   * PT: Resolve o provider de extracao com base na estrategia de ambiente.
   *
   * @params none
   * @returns Provider key used to identify extraction origin.
   */
  private resolveProvider() {
    const openSourceIa =
      this.configService.get<string>('OPEN_SOURCE_IA')?.toLowerCase() ===
      'true';
    if (openSourceIa) {
      return 'ollama';
    }

    return this.configService.get<string>('LLM_PROVIDER') ?? 'openai';
  }
}
