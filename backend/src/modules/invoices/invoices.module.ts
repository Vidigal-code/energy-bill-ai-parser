import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { LlmModule } from '../llm/llm.module';
import { StorageModule } from '../storage/storage.module';
import { InvoicesQueryService } from './application/invoices-query.service';
import { ProcessInvoiceExtractionUseCase } from './application/process-invoice-extraction.use-case';
import { InvoicesController } from './presentation/invoices.controller';
import { resolvePdfMaxFileSizeBytes } from '../../shared/config/pdf-upload.config';

@Module({
  imports: [
    AuthModule,
    AuditModule,
    LlmModule,
    StorageModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        limits: {
          fileSize: resolvePdfMaxFileSizeBytes(
            configService.get<string | number>('PDF_MAX_FILE_SIZE_MB'),
          ),
        },
      }),
    }),
  ],
  controllers: [InvoicesController],
  providers: [ProcessInvoiceExtractionUseCase, InvoicesQueryService],
})
export class InvoicesModule {}
