# Rotas autorizadas

Recebe faturas de energia em PDF, extrai campos estruturados por um provedor multimodal, calcula indicadores e oferece listagem, dashboards, documentos e administração. O resultado deve ser conferido contra o PDF original; validação de esquema não garante que os números foram lidos corretamente.

## Contratos de dados

Invoice vincula uploader, campos extraídos em Decimal/JSON e métricas; StoredDocument guarda bucket/chave, checksum, tamanho e vínculo opcional; AuditLog guarda ator/ação/status. Consultas filtram usuário e papel. Proteja chaves de LLM e de criptografia e mantenha backup dessas chaves para recuperar arquivos. Criptografia em repouso no S3 não impede que o PDF original seja enviado ao provedor escolhido. A UI separa estado local do cache de requisições; o backend determina autorização e valores.

## Fluxo e casos de falha

Login/cadastro → access token e refresh token → JwtAuthGuard/RolesGuard. USER consulta dados do próprio uploaderUserId; ADMIN possui consultas administrativas. RefreshToken armazena hash, jti, expiração, revogação e substituição; não documente o refresh como token sem estado. O inventário de controllers informa todas as rotas reais.

Copie envexample.txt para .env; configure DATABASE_URL, provedor/modelo, chave correspondente, S3 e criptografia. Compose inicia PostgreSQL, LocalStack, backend e frontend; Ollama tem configuração opcional comentada, não presuma que inicia automaticamente. Para Ollama instale as dependências de rasterização do Dockerfile e disponibilize modelo de visão. Backend tem test:unit/test:integration, lint e build; frontend tem lint/build. Em 503 confira provedor/chave; em PDF inválido confira formato/limite; em dashboard vazio confira usuário, filtros e persistência. Os endpoints reais incluem dashboard/consolidated, energy, financial e my-documents.

## Arquivos relacionados

- [backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts)
- [backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts)
- [backend/src/modules/llm/llm.module.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/llm/llm.module.ts)
- [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts)
- [backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)
- [docker-compose.yml](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/docker-compose.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=19)
- [Source reference](?menu=pt&lang=pt&id=20)
