import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiLogger } from '../logging/api-logger';
import { PtBrMessages } from '../messages/pt-br.messages';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    ApiLogger.info({
      context: 'PrismaService',
      message: PtBrMessages.logs.prisma.connecting,
    });
    ApiLogger.info({
      context: 'PrismaConfig',
      message: 'PRISMA CONFIG DB URL: ' + process.env.DATABASE_URL,
    });
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    ApiLogger.info({
      context: 'PrismaService',
      message: PtBrMessages.logs.prisma.shutdownHookRegistered,
    });
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}
