# Arquitetura do Frontend

Recebe faturas de energia em PDF, extrai campos estruturados por um provedor multimodal, calcula indicadores e oferece listagem, dashboards, documentos e administração. O resultado deve ser conferido contra o PDF original; validação de esquema não garante que os números foram lidos corretamente.

## Interface e estado

TypeScript/NestJS 11 com Prisma 6.4/PostgreSQL, Passport/JWT, Argon2, Zod, S3 e JWE; frontend Next.js 16.1.6/React 19.2.3 com Redux Toolkit e TanStack Query. Módulos auth, invoices, llm, storage, audit, admin e health separam apresentação, aplicação e contratos. O caso de uso depende de ILlmExtractor e DocumentStoragePort. O processamento é síncrono na requisição; não há fila de extração neste fluxo.

Invoice vincula uploader, campos extraídos em Decimal/JSON e métricas; StoredDocument guarda bucket/chave, checksum, tamanho e vínculo opcional; AuditLog guarda ator/ação/status. Consultas filtram usuário e papel. Proteja chaves de LLM e de criptografia e mantenha backup dessas chaves para recuperar arquivos. Criptografia em repouso no S3 não impede que o PDF original seja enviado ao provedor escolhido. A UI separa estado local do cache de requisições; o backend determina autorização e valores.

Login/cadastro → access token e refresh token → JwtAuthGuard/RolesGuard. USER consulta dados do próprio uploaderUserId; ADMIN possui consultas administrativas. RefreshToken armazena hash, jti, expiração, revogação e substituição; não documente o refresh como token sem estado. O inventário de controllers informa todas as rotas reais.

## Fontes verificadas

- [frontend/src/app/admin/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/admin/page.tsx)
- [frontend/src/app/api/auth/login/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/login/route.ts)
- [frontend/src/app/api/auth/logout/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/logout/route.ts)
- [frontend/src/app/api/auth/me/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/me/route.ts)
- [frontend/src/app/api/auth/refresh/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/refresh/route.ts)
- [frontend/src/app/api/auth/register/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/register/route.ts)
- [frontend/src/app/api/proxy/[...path]/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/proxy/[...path]/route.ts)
- [frontend/src/app/dashboard/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/dashboard/page.tsx)
- [frontend/src/app/invoices/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/invoices/page.tsx)
- [frontend/src/app/login/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/login/page.tsx)
- [frontend/src/app/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/page.tsx)
- [frontend/src/app/profile/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/profile/page.tsx)
- [frontend/src/app/register/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/register/page.tsx)
- [frontend/src/entities/admin/api/admin.client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/admin/api/admin.client.ts)
- [frontend/src/entities/auth/api/auth.client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/auth/api/auth.client.ts)
- [frontend/src/entities/auth/model/auth.slice.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/auth/model/auth.slice.ts)
- [frontend/src/entities/invoice/api/invoice.client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/invoice/api/invoice.client.ts)
- [frontend/src/shared/api/client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/api/client.ts)
- [frontend/src/shared/api/server-auth.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/api/server-auth.ts)
- [frontend/src/shared/api/types.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/api/types.ts)
- [frontend/src/shared/store/hooks.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/store/hooks.ts)
- [frontend/src/shared/store/store.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/store/store.ts)

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
