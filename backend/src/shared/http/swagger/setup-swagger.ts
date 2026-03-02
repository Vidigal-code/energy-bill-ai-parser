import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

type SetupSwaggerInput = {
  app: INestApplication;
  enabled: boolean;
  path: string;
};

export function setupSwagger(input: SetupSwaggerInput): void {
  if (!input.enabled) {
    return;
  }

  const configPt = new DocumentBuilder()
    .setTitle('Plataforma de Faturas de Energia (API)')
    .setDescription(
      'Documentação da API backend para autenticação, processamento de faturas e administração.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentPt = SwaggerModule.createDocument(input.app, configPt);
  SwaggerModule.setup('api/docs/pt', input.app, documentPt);

  const configEn = new DocumentBuilder()
    .setTitle('Energy Bill AI Parser API')
    .setDescription(
      'Backend API documentation for authentication, invoice processing, and administration.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentEn = SwaggerModule.createDocument(input.app, configEn);
  SwaggerModule.setup('api/docs/en', input.app, documentEn);
}
