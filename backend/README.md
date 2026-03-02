# Backend - Energy Bill AI Parser

<details>
<summary><strong>🇧🇷 Português</strong></summary>

## Visão geral

Backend NestJS com arquitetura modular para extração de dados de faturas em PDF, autenticação enterprise, RBAC, auditoria e armazenamento criptografado.

Este backend está integrado ao frontend Next.js do repositório via sessão segura com cookies HTTP-only e proxy autenticado.

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
   > **Nota sobre I.A Open-Source (Ollama)**: Se configurado para usar o Ollama, o backend converte automaticamente a primeira página do PDF para uma imagem PNG em base64 (usando `pdf2pic` e `ghostscript`) antes de enviar para a API. Isso ocorre pois a API nativa do Ollama (vision) não aceita arquivos `.pdf` de forma nativa como o Gemini ou Claude, requerendo dados de imagem no array `images`. Para cumprir o requisito estrito do desafio de "enviar o próprio arquivo PDF" para o LLM, o Gemini é o provedor configurado como padrão, pois aceita o documento nativamente sem pré-processamento.
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
- Políticas de cabeçalho HTTP com Helmet.
- Rate limit global com `@nestjs/throttler`.

## Principais variáveis de ambiente

- Core: `NODE_ENV`, `PORT`, `DATABASE_URL`, `LOGS`
- API security: `HELMET_ENABLED`, `RATE_LIMIT_TTL_MS`, `RATE_LIMIT_LIMIT`
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

## TDD (unitário + integração)

```bash
npm run test:unit
npm run test:integration
npm run test
```

Teste opcional com persistência real no banco (Postgres):

```bash
RUN_DB_INTEGRATION=true npm run test:integration
```

## Swagger (OpenAPI)

- URL Português: `http://localhost:3000/api/docs/pt`
- URL English: `http://localhost:3000/api/docs/en`
- Configuração por env:
  - `SWAGGER_ENABLED=true|false`

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

## Checklist de aceite técnico

- `npm run lint`
- `npm run test`
- `docker compose up --build`

## Roteiro de validação prática da extração

1. Subir stack completa e autenticar usuário.
2. Enviar PDF real em `POST /api/invoices/extract`.
3. Validar retorno da extração com os campos:
   - `numeroCliente`
   - `mesReferencia`
   - `itensFatura.energiaEletrica.{quantidadeKwh,valorRs}`
   - `itensFatura.energiaSceeSemIcms.{quantidadeKwh,valorRs}`
   - `itensFatura.energiaCompensadaGdi.{quantidadeKwh,valorRs}`
   - `itensFatura.contribIlumPublicaMunicipal.valorRs`
4. Confirmar métricas agregadas:
   - `consumoEnergiaEletricaKwh`
   - `energiaCompensadaKwh`
   - `valorTotalSemGdRs`
   - `economiaGdRs`
5. Validar persistência:
   - fatura e métricas no banco;
   - documento criptografado no storage;
   - trilha de auditoria com ator, status e meta.

### Evidência de referência (fatura exemplo JAN/2024)

- `numeroCliente`: `7204076116`
- `mesReferencia`: `JAN/2024`
- `energiaEletrica`: `50 kWh` / `R$ 47,75`
- `energiaSceeSemIcms`: `456 kWh` / `R$ 232,42`
- `energiaCompensadaGdi`: `456 kWh` / `R$ -222,22`
- `contribIlumPublicaMunicipal`: `R$ 49,43`
- `consumoEnergiaEletricaKwh`: `506`
- `energiaCompensadaKwh`: `456`
- `valorTotalSemGdRs`: `329,60`
- `economiaGdRs`: `-222,22`

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
- HTTP header policies with Helmet.
- Global rate limiting with `@nestjs/throttler`.

## Main Environment Variables

- Core: `NODE_ENV`, `PORT`, `DATABASE_URL`, `LOGS`
- API security: `HELMET_ENABLED`, `RATE_LIMIT_TTL_MS`, `RATE_LIMIT_LIMIT`
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

Optional real-database integration check (Postgres):

```bash
RUN_DB_INTEGRATION=true npm run test:integration
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

## Docker (API + infrastructure + Ollama model)

From repository root:

```bash
docker compose up --build
```

Orchestration flow:

- `postgres` and `localstack` start first;
- `backend` starts and runs `prisma db push` on startup.
- `frontend` (Next.js) pode subir no mesmo `docker compose` consumindo a API internamente por hostname de serviço.

> **Ollama**: Os serviços locais do Ollama (`ollama` e `ollama-init`) vêm **comentados por padrão** no `docker-compose.yml` para economizar recursos da máquina, já que a aplicação está configurada para usar a API ultra rápida e com suporte nativo a PDF do **Gemini** para o desafio. Se desejar rodar a IA 100% local, basta descomentar esses blocos no docker-compose e ajustar o `.env` (`OPEN_SOURCE_IA=true`).

## Technical Acceptance Checklist

- `npm run lint`
- `npm run test`
- `docker compose up --build`

## Practical Extraction Validation Script

1. Start the full stack and authenticate.
2. Upload a real PDF to `POST /api/invoices/extract`.
3. Validate extraction response fields:
   - `numeroCliente`
   - `mesReferencia`
   - `itensFatura.energiaEletrica.{quantidadeKwh,valorRs}`
   - `itensFatura.energiaSceeSemIcms.{quantidadeKwh,valorRs}`
   - `itensFatura.energiaCompensadaGdi.{quantidadeKwh,valorRs}`
   - `itensFatura.contribIlumPublicaMunicipal.valorRs`
4. Confirm computed metrics:
   - `consumoEnergiaEletricaKwh`
   - `energiaCompensadaKwh`
   - `valorTotalSemGdRs`
   - `economiaGdRs`
5. Validate persistence:
   - invoice and metrics in database;
   - encrypted document in storage;
   - audit trail with actor, status, and metadata.

</details>
