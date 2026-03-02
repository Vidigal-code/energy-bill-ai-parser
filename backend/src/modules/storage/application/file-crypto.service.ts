import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compactDecrypt, CompactEncrypt } from 'jose';
import { createHash } from 'crypto';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';

@Injectable()
export class FileCryptoService {
  constructor(private readonly configService: ConfigService) {}

  async encrypt(content: Buffer): Promise<Buffer> {
    ApiLogger.info({
      context: 'FileCryptoService',
      message: PtBrMessages.logs.crypto.encryptingFile,
    });
    const secret = this.getSecretKey();
    const jwe = await new CompactEncrypt(content)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(secret);

    return Buffer.from(jwe, 'utf-8');
  }

  async decrypt(content: Buffer): Promise<Buffer> {
    ApiLogger.info({
      context: 'FileCryptoService',
      message: PtBrMessages.logs.crypto.decryptingFile,
    });
    const secret = this.getSecretKey();
    const { plaintext } = await compactDecrypt(
      content.toString('utf-8'),
      secret,
    );
    return Buffer.from(plaintext);
  }

  checksum(content: Buffer): string {
    return createHash('sha256').update(content).digest('hex');
  }

  private getSecretKey(): Uint8Array {
    const secret = this.configService.get<string>('JWE_SECRET') ?? '';
    return new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32));
  }
}
