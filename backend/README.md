# Backend - Energy Bill AI Parser

<details>
<summary><strong>🇧🇷 Português</strong></summary>

## Visão geral

Backend NestJS com arquitetura modular para extração de dados de faturas em PDF, autenticação enterprise, RBAC, auditoria e armazenamento criptografado.

## Módulos atuais (`src/modules`)

- `auth`
  - registro, login, refresh token, logout, perfil;
  - `JwtAuthGuard` e `RolesGuard`;
  - decorators `@Public`, `@Roles`, `@CurrentUser`.
- `admin`
  - CRUD administrativo de usuários;
  - listagem e gestão de documentos, faturas e logs de auditoria;
  - download de documento com descriptografia.
- `invoices`
  - upload e processamento de fatura;
  - consulta de faturas e dashboards;
  - restrição por papel (`ADMIN` vê tudo, `USER` vê apenas os próprios dados).
- `llm`
  - seleção dinâmica de provider;
  - adapters para Ollama, OpenAI, Gemini/Google e Claude.
- `storage`
  - criptografia/descriptografia JWE (`FileCryptoService`);
  - adapter S3 (`S3DocumentStorageAdapter`) com LocalStack em ambiente local.
- `audit`
  - persistência de trilha de auditoria.
- `health`
  - endpoint de saúde da API.

## Shared (`src/shared`)

- `config`
  - validação de env com Zod;
  - utilitários de duração JWT;
  - configuração de limite máximo de PDF.
- `http`
  - resposta padrão centralizada (`ApiResponsePresenter`);
  - interceptor global de sucesso;
  - filtro global de exceções.
- `logging`
  - `ApiLogger` com níveis e cores ANSI.
- `messages`
  - `pt-br.messages.ts` como fonte única de mensagens de negócio, erro e log.
- `prisma`
  - `PrismaService` e `PrismaModule`.

## Fluxo de processamento de fatura

1. Upload via `POST /api/invoices/extract`.
2. Validação de tipo e tamanho do PDF (`PDF_MAX_FILE_SIZE_MB`).
3. Criptografia JWE do arquivo.
4. Upload em storage S3.
5. Extração via provider LLM configurado.
6. Cálculo de métricas de negócio.
7. Persistência transacional (fatura, métricas, documento).
8. Registro de auditoria e rollback de arquivo em caso de falha.

## Contrato de extração

Arquivo central:

- `src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Configuração por ambiente:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Resposta HTTP padrão

- Sucesso: `{ success, path, timestamp, data }`
- Erro: `{ success, path, timestamp, error: { statusCode, message, details } }`

## Segurança

- Autenticação JWT aplicada globalmente.
- RBAC completo por papel (`ADMIN`, `USER`).
- Refresh token com rotação e persistência.
- Criptografia de arquivos com JWE.
- Auditoria de ações sensíveis.

## Principais variáveis de ambiente

- Core: `NODE_ENV`, `PORT`, `DATABASE_URL`, `LOGS`
- Auth: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `JWT_ISSUER`
- RBAC/admin inicial: `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_USERNAME`, `DEFAULT_ADMIN_PASSWORD`
- LLM: `OPEN_SOURCE_IA`, `LLM_PROVIDER`, `OLLAMA_*`, `OPENAI_*`, `GEMINI_*`, `ANTHROPIC_*`
- Extraction: `INVOICE_EXTRACTION_REFERENCE`, `INVOICE_EXTRACTION_PROMPT`, `INVOICE_EXTRACTION_CONTEXT`
- Upload: `PDF_MAX_FILE_SIZE_MB`
- Storage: `STORAGE_DRIVER`, `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`, `JWE_SECRET`

## Execução local

```bash
npm install
npm run lint
npm run build
npm run start:dev
```

Endpoints úteis:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/invoices/extract`
- `GET /api/invoices`
- `GET /api/invoices/dashboard/energy`
- `GET /api/invoices/dashboard/financial`
- `GET /api/admin/*` (somente ADMIN)

</details>

<details>
<summary><strong>🇬🇧 English</strong></summary>

## Overview

NestJS backend with modular architecture for PDF bill extraction, enterprise auth, RBAC, auditing, and encrypted storage.

## Current Modules (`src/modules`)

- `auth`
  - register, login, refresh token, logout, profile;
  - `JwtAuthGuard` and `RolesGuard`;
  - decorators `@Public`, `@Roles`, `@CurrentUser`.
- `admin`
  - admin CRUD for users;
  - list/manage documents, invoices, and audit logs;
  - download document with decryption.
- `invoices`
  - bill upload and processing;
  - invoice listing and dashboards;
  - role-aware access (`ADMIN` sees all, `USER` sees only own data).
- `llm`
  - dynamic provider selection;
  - adapters for Ollama, OpenAI, Gemini/Google, and Claude.
- `storage`
  - JWE encryption/decryption (`FileCryptoService`);
  - S3 adapter (`S3DocumentStorageAdapter`) with LocalStack locally.
- `audit`
  - audit trail persistence.
- `health`
  - API health endpoint.

## Shared (`src/shared`)

- `config`
  - env validation with Zod;
  - JWT duration utils;
  - max PDF size config.
- `http`
  - centralized response contract (`ApiResponsePresenter`);
  - global success interceptor;
  - global exception filter.
- `logging`
  - `ApiLogger` with levels and ANSI colors.
- `messages`
  - `pt-br.messages.ts` as single source for business/error/log messages.
- `prisma`
  - `PrismaService` and `PrismaModule`.

## Invoice Processing Flow

1. Upload via `POST /api/invoices/extract`.
2. Validate PDF type and size (`PDF_MAX_FILE_SIZE_MB`).
3. Encrypt file using JWE.
4. Upload encrypted content to S3 storage.
5. Extract data through configured LLM provider.
6. Compute business metrics.
7. Persist invoice/metrics/document in a transaction.
8. Write audit log and rollback uploaded file on failure.

## Extraction Contract

Central file:

- `src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Environment-driven settings:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Standard HTTP Response

- Success: `{ success, path, timestamp, data }`
- Error: `{ success, path, timestamp, error: { statusCode, message, details } }`

## Security

- Global JWT authentication.
- Full RBAC by role (`ADMIN`, `USER`).
- Refresh token rotation with persistence.
- JWE encrypted file storage.
- Sensitive action auditing.

## Main Environment Variables

- Core: `NODE_ENV`, `PORT`, `DATABASE_URL`, `LOGS`
- Auth: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `JWT_ISSUER`
- Default admin: `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_USERNAME`, `DEFAULT_ADMIN_PASSWORD`
- LLM: `OPEN_SOURCE_IA`, `LLM_PROVIDER`, `OLLAMA_*`, `OPENAI_*`, `GEMINI_*`, `ANTHROPIC_*`
- Extraction: `INVOICE_EXTRACTION_REFERENCE`, `INVOICE_EXTRACTION_PROMPT`, `INVOICE_EXTRACTION_CONTEXT`
- Upload: `PDF_MAX_FILE_SIZE_MB`
- Storage: `STORAGE_DRIVER`, `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`, `JWE_SECRET`

## Local Run

```bash
npm install
npm run lint
npm run build
npm run start:dev
```

Useful endpoints:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/invoices/extract`
- `GET /api/invoices`
- `GET /api/invoices/dashboard/energy`
- `GET /api/invoices/dashboard/financial`
- `GET /api/admin/*` (ADMIN only)

</details>
