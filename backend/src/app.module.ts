import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { envSchema } from './shared/config/env.schema';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
      validate: (config) => envSchema.parse(config),
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    InvoicesModule,
    AdminModule,
  ],
})
export class AppModule {}
