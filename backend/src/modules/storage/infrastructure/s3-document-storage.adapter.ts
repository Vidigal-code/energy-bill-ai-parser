import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  DocumentStoragePort,
  StoredDocumentFile,
  UploadDocumentInput,
} from '../domain/document-storage.port';

@Injectable()
export class S3DocumentStorageAdapter implements DocumentStoragePort {
  private readonly client: S3Client;
  private readonly bucket: string;

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

  async upload(input: UploadDocumentInput): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: input.objectKey,
        Body: input.content,
        ContentType: input.mimeType,
      }),
    );
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
}
