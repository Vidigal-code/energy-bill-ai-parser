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
  localizeSwaggerDocumentToEnglish(
    documentEn as unknown as Record<string, unknown>,
  );
  SwaggerModule.setup('api/docs/en', input.app, documentEn);
}

function localizeSwaggerDocumentToEnglish(document: Record<string, unknown>) {
  const paths = document.paths;
  if (!paths || typeof paths !== 'object') {
    return;
  }

  for (const pathItem of Object.values(paths as Record<string, unknown>)) {
    if (!pathItem || typeof pathItem !== 'object') {
      continue;
    }

    for (const operation of Object.values(
      pathItem as Record<string, unknown>,
    )) {
      if (!operation || typeof operation !== 'object') {
        continue;
      }

      const op = operation as { summary?: unknown; description?: unknown };

      if (typeof op.summary === 'string') {
        op.summary = translateSummaryToEnglish(op.summary);
      }

      if (typeof op.description === 'string') {
        op.description = translateDescriptionToEnglish(op.description);
      }
    }
  }
}

function translateSummaryToEnglish(summary: string) {
  const map: Record<string, string> = {
    'Verificar saúde da API': 'Check API health',
    'Registrar usuário': 'Register user',
    'Autenticar usuário': 'Authenticate user',
    'Gerar novo access token via refresh token':
      'Generate new access token via refresh token',
    'Encerrar sessão do usuário': 'End user session',
    'Obter perfil do usuário autenticado': 'Get authenticated user profile',
    'Atualizar perfil do usuário autenticado':
      'Update authenticated user profile',
    'Enviar PDF e processar extração da fatura':
      'Upload PDF and process invoice extraction',
    'Listar faturas com filtros': 'List invoices with filters',
    'Consultar dashboard consolidado (energia + financeiro)':
      'Get consolidated dashboard (energy + financial)',
    'Consultar dashboard de energia (kWh)': 'Get energy dashboard (kWh)',
    'Consultar dashboard financeiro (R$)': 'Get financial dashboard (BRL)',
    'Listar documentos do usuário autenticado':
      'List authenticated user documents',
    'Listar usuários (admin)': 'List users (admin)',
    'Criar usuário (admin)': 'Create user (admin)',
    'Atualizar usuário (admin)': 'Update user (admin)',
    'Remover usuário (admin)': 'Delete user (admin)',
    'Listar documentos com filtros (admin)':
      'List documents with filters (admin)',
    'Listar faturas com filtros (admin)': 'List invoices with filters (admin)',
    'Atualizar mês de referência da fatura (admin)':
      'Update invoice reference month (admin)',
    'Remover fatura (admin)': 'Delete invoice (admin)',
    'Baixar documento descriptografado (admin)':
      'Download decrypted document (admin)',
    'Remover documento (admin)': 'Delete document (admin)',
    'Listar logs de auditoria com filtros (admin)':
      'List audit logs with filters (admin)',
  };

  return map[summary] ?? summary;
}

function translateDescriptionToEnglish(description: string) {
  const map: Record<string, string> = {
    'Usuários listados com sucesso': 'Users listed successfully',
    'Usuário criado com sucesso': 'User created successfully',
    'Usuário atualizado com sucesso': 'User updated successfully',
    'Usuário removido com sucesso': 'User removed successfully',
    'Documentos listados com sucesso': 'Documents listed successfully',
    'Faturas listadas com sucesso': 'Invoices listed successfully',
    'Mês de referência atualizado com sucesso':
      'Reference month updated successfully',
    'Fatura removida com sucesso': 'Invoice removed successfully',
    'Documento retornado com sucesso': 'Document returned successfully',
    'Documento removido com sucesso': 'Document removed successfully',
    'Logs de auditoria listados com sucesso': 'Audit logs listed successfully',
    'Fatura processada com sucesso': 'Invoice processed successfully',
    'Lista de faturas retornada com sucesso':
      'Invoice list returned successfully',
    'Dashboard consolidado retornado com sucesso':
      'Consolidated dashboard returned successfully',
    'Dashboard de energia retornado com sucesso':
      'Energy dashboard returned successfully',
    'Dashboard financeiro retornado com sucesso':
      'Financial dashboard returned successfully',
    'Documentos retornados com sucesso': 'Documents returned successfully',
  };

  return map[description] ?? description;
}
