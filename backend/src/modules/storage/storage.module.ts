import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileCryptoService } from './application/file-crypto.service';
import {
  DOCUMENT_STORAGE_TOKEN,
  DocumentStoragePort,
} from './domain/document-storage.port';
import { S3DocumentStorageAdapter } from './infrastructure/s3-document-storage.adapter';

@Module({
  providers: [
    FileCryptoService,
    S3DocumentStorageAdapter,
    {
      provide: DOCUMENT_STORAGE_TOKEN,
      inject: [ConfigService, S3DocumentStorageAdapter],
      useFactory: (
        _configService: ConfigService,
        adapter: S3DocumentStorageAdapter,
      ): DocumentStoragePort => adapter,
    },
  ],
  exports: [DOCUMENT_STORAGE_TOKEN, FileCryptoService],
})
export class StorageModule {}
