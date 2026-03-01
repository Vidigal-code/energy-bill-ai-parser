import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/http/filters/http-exception.filter';
import { SuccessResponseInterceptor } from './shared/http/interceptors/success-response.interceptor';
import { ApiLogger } from './shared/logging/api-logger';

async function bootstrap() {
  ApiLogger.log({ context: 'Bootstrap', message: 'Starting API bootstrap.' });
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  ApiLogger.info({
    context: 'Bootstrap',
    message: `API started on port ${port}.`,
  });
}
void bootstrap().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : 'Unknown bootstrap error';
  ApiLogger.logError({
    path: 'bootstrap',
    method: 'SYSTEM',
    statusCode: 500,
    message,
  });
  process.exit(1);
});
