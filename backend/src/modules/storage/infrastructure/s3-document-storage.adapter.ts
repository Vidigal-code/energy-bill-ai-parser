import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ApiLogger } from '../../../shared/logging/api-logger';
import {
  DocumentStoragePort,
  StoredDocumentFile,
  UploadDocumentInput,
} from '../domain/document-storage.port';

@Injectable()
export class S3DocumentStorageAdapter
  implements DocumentStoragePort, OnModuleInit
{
  private readonly client: S3Client;
  private readonly bucket: string;
  private bucketReady = false;
  private bucketEnsuringPromise: Promise<void> | null = null;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET') ?? 'energy-bills';
    this.client = new S3Client({
      region: this.configService.get<string>('S3_REGION') ?? 'us-east-1',
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      forcePathStyle:
        this.configService.get<string>('S3_FORCE_PATH_STYLE') === 'true',
      credentials: {
        accessKeyId:
          this.configService.get<string>('S3_ACCESS_KEY_ID') ?? 'test',
        secretAccessKey:
          this.configService.get<string>('S3_SECRET_ACCESS_KEY') ?? 'test',
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucketExists();
  }

  async upload(input: UploadDocumentInput): Promise<void> {
    try {
      await this.ensureBucketExists();
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: input.objectKey,
          Body: input.content,
          ContentType: input.mimeType,
        }),
      );
    } catch (e) {
      ApiLogger.logError({
        path: 'S3-upload',
        statusCode: 500,
        message: 'Falha fatal ao enviar arquivo para o bucket S3.',
        error: e,
      });
      throw e;
    }
  }

  async download(objectKey: string): Promise<StoredDocumentFile> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
      }),
    );

    const bytes = await response.Body?.transformToByteArray();
    return {
      content: Buffer.from(bytes ?? []),
      mimeType: response.ContentType ?? 'application/octet-stream',
    };
  }

  async remove(objectKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
      }),
    );
  }

  private async ensureBucketExists(): Promise<void> {
    if (this.bucketReady) {
      return;
    }
    if (this.bucketEnsuringPromise) {
      await this.bucketEnsuringPromise;
      return;
    }

    this.bucketEnsuringPromise = this.ensureBucketExistsInternal();
    try {
      await this.bucketEnsuringPromise;
      this.bucketReady = true;
    } finally {
      this.bucketEnsuringPromise = null;
    }
  }

  private async ensureBucketExistsInternal(): Promise<void> {
    if (await this.bucketExists()) {
      return;
    }

    try {
      await this.client.send(
        new CreateBucketCommand({
          Bucket: this.bucket,
        }),
      );

      ApiLogger.info({
        context: 'S3Storage',
        message: `Bucket ${this.bucket} criado automaticamente.`,
      });
    } catch (error) {
      if (this.isAlreadyExistsError(error)) {
        return;
      }

      ApiLogger.logError({
        path: 'S3-create-bucket',
        statusCode: 500,
        message: `Falha ao criar bucket ${this.bucket}.`,
        error,
      });
      throw error;
    }
  }

  private async bucketExists(): Promise<boolean> {
    try {
      await this.client.send(
        new HeadBucketCommand({
          Bucket: this.bucket,
        }),
      );
      return true;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return false;
      }
      throw error;
    }
  }

  private isNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const maybe = error as {
      name?: string;
      Code?: string;
      $metadata?: { httpStatusCode?: number };
    };
    return (
      maybe.name === 'NotFound' ||
      maybe.Code === 'NoSuchBucket' ||
      maybe.$metadata?.httpStatusCode === 404
    );
  }

  private isAlreadyExistsError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const maybe = error as { name?: string; Code?: string };
    return (
      maybe.name === 'BucketAlreadyOwnedByYou' ||
      maybe.Code === 'BucketAlreadyOwnedByYou' ||
      maybe.name === 'BucketAlreadyExists' ||
      maybe.Code === 'BucketAlreadyExists'
    );
  }
}
