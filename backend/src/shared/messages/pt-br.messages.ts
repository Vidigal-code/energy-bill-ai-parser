export class PtBrMessages {
  static readonly common = {
    unknownError: 'Erro desconhecido.',
    internalServerError: 'Erro interno do servidor.',
  };

  static readonly auth = {
    emailAlreadyExists: 'Este e-mail ja existe.',
    usernameAlreadyExists: 'Este nome de usuario ja existe.',
    invalidCredentials: 'Credenciais invalidas.',
    invalidRefreshToken: 'Refresh token invalido.',
    tokenDoesNotBelongToAuthenticatedUser:
      'Token nao pertence ao usuario autenticado.',
    userNotFound: 'Usuario nao encontrado.',
    noDataForUpdate: 'Nenhum dado valido foi enviado para atualizacao.',
    logoutSuccess: 'Logout realizado com sucesso.',
    userRegistered: 'Usuario registrado com sucesso.',
    loginSuccess: 'Login realizado com sucesso.',
    profileUpdated: 'Perfil atualizado com sucesso.',
    unauthenticated: 'Nao autenticado.',
    noPermission: 'Sem permissao para acessar este recurso.',
    accessDenied403: {
      statusCode: 403,
      error: 'Forbidden',
      message: 'Sem permissao para acessar este recurso.',
    },
    passwordMustContainUppercase:
      'A senha deve conter ao menos uma letra maiuscula.',
    passwordMustContainLowercase:
      'A senha deve conter ao menos uma letra minuscula.',
    passwordMustContainNumber: 'A senha deve conter ao menos um numero.',
    passwordMustContainSpecialChar:
      'A senha deve conter ao menos um caractere especial.',
  };

  static readonly invoices = {
    onlyPdfSupported: 'Apenas arquivos PDF sao suportados.',
    unsupportedFileType: (mimeType: string) =>
      `Apenas arquivos PDF sao suportados. Tipo recebido: ${mimeType}.`,
    fileExceededMaxLimit: (maxMb: number) =>
      `Nao vamos processar o arquivo porque ele excedeu o limite maximo permitido de ${maxMb} MB.`,
    uploadFileRequired:
      'Arquivo obrigatorio. Use multipart/form-data com campo "file".',
    invoiceProcessed: 'Fatura processada com sucesso.',
    failedToProcessInvoice: 'Falha ao processar fatura.',
    failedRollbackFileRemoval:
      'Falha ao remover arquivo durante rollback de erro.',
    pdfExceededMaximumAllowed:
      'Nao vamos processar porque o arquivo PDF excedeu o limite maximo permitido.',
    invalidPeriodoInicio:
      'Periodo inicio invalido. Use MMM/YYYY, MM/YYYY ou YYYY-MM.',
    invalidPeriodoFim:
      'Periodo fim invalido. Use MMM/YYYY, MM/YYYY ou YYYY-MM.',
    invalidPeriodoRange:
      'Periodo invalido: periodo inicio nao pode ser maior que periodo fim.',
  };

  static readonly admin = {
    userRemoved: 'Usuario removido com sucesso.',
    invoiceRemoved: 'Fatura removida com sucesso.',
    documentRemoved: 'Documento removido com sucesso.',
    invoiceNotFound: 'Fatura nao encontrada.',
    documentNotFound: 'Documento nao encontrado.',
  };

  static readonly llm = {
    unsupportedProvider: 'Provider configurado nao suportado.',
    missingConfiguration: (key: string, provider: string) =>
      `Configuracao ausente ${key} para provider ${provider}.`,
    requestFailed: (provider: string) =>
      `Falha na requisicao do provider ${provider}.`,
    emptyResponse: (provider: string) =>
      `Provider ${provider} retornou resposta vazia.`,
    invalidExtractionPayload:
      'Payload de extracao invalido retornado pelo provider de IA.',
  };

  static readonly system = {
    bootstrapStarting: 'Inicializando bootstrap da API.',
    bootstrapStarted: (port: number) => `API iniciada na porta ${port}.`,
  };

  static readonly logs = {
    auth: {
      defaultAdminCreated: (email: string) =>
        `Usuario admin padrao criado: ${email}.`,
      registeringUser: 'Registrando novo usuario.',
      authenticatingUser: 'Autenticando usuario.',
      refreshingSession: 'Atualizando sessao com refresh token.',
      loggingOutUser: (userId: string) =>
        `Encerrando sessao do usuario ${userId}.`,
      loadingAuthenticatedUser: (userId: string) =>
        `Carregando perfil do usuario ${userId}.`,
      updatingAuthenticatedUserProfile: (userId: string) =>
        `Atualizando perfil do usuario ${userId}.`,
    },
    invoices: {
      processingFile: (fileName: string) => `Processando arquivo ${fileName}.`,
    },
    invoicesQuery: {
      listingInvoices: 'Consultando lista de faturas.',
      buildingEnergyDashboard: 'Montando dashboard de energia.',
      buildingFinancialDashboard: 'Montando dashboard financeiro.',
      buildingConsolidatedDashboard: 'Montando dashboard consolidado.',
      listingMyDocuments: 'Consultando documentos do usuario.',
    },
    admin: {
      listingUsers: 'Listando usuarios.',
      creatingUser: 'Criando usuario.',
      updatingUser: (userId: string) => `Atualizando usuario ${userId}.`,
      deletingUser: (userId: string) => `Removendo usuario ${userId}.`,
      listingDocuments: 'Listando documentos.',
      listingAuditLogs: 'Listando auditorias.',
      listingInvoices: 'Listando faturas.',
      updatingInvoiceReferenceMonth: (invoiceId: string) =>
        `Atualizando mes de referencia da fatura ${invoiceId}.`,
      deletingInvoice: (invoiceId: string) => `Removendo fatura ${invoiceId}.`,
      deletingDocument: (documentId: string) =>
        `Removendo documento ${documentId}.`,
      downloadingDocument: (documentId: string) =>
        `Baixando documento ${documentId}.`,
    },
    audit: {
      writingEntry: (action: string) =>
        `Registrando entrada de auditoria para acao ${action}.`,
    },
    crypto: {
      encryptingFile: 'Criptografando arquivo.',
      decryptingFile: 'Descriptografando arquivo.',
    },
    prisma: {
      connecting: 'Conectando ao banco de dados.',
      shutdownHookRegistered: 'Hook de encerramento do Prisma registrado.',
    },
    llm: {
      providerSelected: (provider: string, rollbackOnFailure: boolean) =>
        `Provider selecionado: ${provider}. Rollback em falha de extracao: ${rollbackOnFailure}.`,
    },
  };
}
