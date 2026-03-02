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

  const config = new DocumentBuilder()
    .setTitle('Energy Bill AI Parser API')
    .setDescription(
      'Documentação da API backend para autenticação, processamento de faturas e administração.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(input.app, config);
  SwaggerModule.setup(input.path, input.app, document);
}
