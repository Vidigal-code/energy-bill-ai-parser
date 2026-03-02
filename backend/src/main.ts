import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/presentation/guards/roles.guard';
import { HttpExceptionFilter } from './shared/http/filters/http-exception.filter';
import { SuccessResponseInterceptor } from './shared/http/interceptors/success-response.interceptor';
import { ApiLogger } from './shared/logging/api-logger';
import { PtBrMessages } from './shared/messages/pt-br.messages';

async function bootstrap() {
  ApiLogger.log({
    context: 'Bootstrap',
    message: PtBrMessages.system.bootstrapStarting,
  });
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(RolesGuard));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  ApiLogger.info({
    context: 'Bootstrap',
    message: PtBrMessages.system.bootstrapStarted(port),
  });
}
void bootstrap().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : PtBrMessages.common.unknownError;
  ApiLogger.logError({
    path: 'bootstrap',
    method: 'SYSTEM',
    statusCode: 500,
    message,
  });
  process.exit(1);
});
