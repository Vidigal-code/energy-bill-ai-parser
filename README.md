# Energy Bill AI Parser

Backend enterprise-oriented para processamento de faturas de energia com IA, autenticação segura, RBAC, auditoria e armazenamento criptografado.

<details>
<summary><strong>🇧🇷 Descrição em Português</strong></summary>

## Objetivo atual

O foco atual do repositório é o backend em NestJS para:

- upload de PDF;
- extração estruturada com múltiplos provedores de IA;
- cálculo de métricas de negócio;
- persistência com Prisma/PostgreSQL;
- controle de acesso com JWT + RBAC (`ADMIN` e `USER`);
- trilha de auditoria e gestão administrativa completa.

## Stack

- Node.js, NestJS, TypeScript
- Prisma ORM, PostgreSQL
- LLMs: Ollama, OpenAI, Gemini/Google, Claude/Anthropic
- AWS S3 (LocalStack no ambiente local)
- Docker Compose

## Arquitetura atual (resumo)

- `backend/src/modules/auth`: registro, login, refresh token, logout, perfil e guards.
- `backend/src/modules/admin`: CRUD administrativo de usuários, documentos, faturas e auditoria.
- `backend/src/modules/invoices`: upload, extração, dashboards e listagem por papel.
- `backend/src/modules/llm`: seleção dinâmica de provider e adapters por provedor.
- `backend/src/modules/storage`: criptografia JWE e armazenamento S3.
- `backend/src/modules/audit`: persistência de logs de auditoria.
- `backend/src/shared`: config/env, logger, resposta HTTP padrão, filtros e mensagens centralizadas.

## Extração configurável

Contrato central de extração:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Configuração principal via variáveis de ambiente:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Segurança e padrões

- Rotas protegidas por autenticação global (exceto rotas públicas de auth/health).
- RBAC com `ADMIN` e `USER`.
- Helmet com políticas globais de cabeçalho HTTP.
- Rate limit global com `@nestjs/throttler`.
- Respostas centralizadas em formato padrão (`success/error`).
- Mensagens e logs centralizados em `backend/src/shared/messages/pt-br.messages.ts`.
- Logger sem `console`, com níveis (`LOG`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`).

## Ambiente

Use somente arquivos de ambiente na raiz:

- `/.env`
- `/.env.example`

## Execução com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Para executar a suíte de testes em container:

```bash
docker compose --profile test up --build backend-tests
```

Serviços principais:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/api/health`
- PostgreSQL: `localhost:5432`
- Ollama: `http://localhost:11434`
- LocalStack (S3): `http://localhost:4566`

## Checklist de validação (escopo backend)

- `npm run lint` em `backend`;
- `npm run test` em `backend` (unitário + integração);
- `npm run build` em `backend`;
- `docker compose up --build` para infraestrutura + API;
- `docker compose --profile test up --build backend-tests` para testes em container.

## Roteiro de validação prática (fatura)

Com um PDF real do desafio, validar campo a campo:

- `numeroCliente`;
- `mesReferencia`;
- `itensFatura.energiaEletrica.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaSceeSemIcms.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaCompensadaGdi.{quantidadeKwh,valorRs}`;
- `itensFatura.contribIlumPublicaMunicipal.valorRs`.

E validar métricas calculadas:

- `consumoEnergiaEletricaKwh`;
- `energiaCompensadaKwh`;
- `valorTotalSemGdRs`;
- `economiaGdRs`.

</details>

<details>
<summary><strong>🇬🇧 English Description</strong></summary>

## Current Goal

The current repository focus is the NestJS backend to provide:

- PDF upload;
- structured extraction with multiple AI providers;
- business metrics computation;
- Prisma/PostgreSQL persistence;
- secure auth and RBAC (`ADMIN` and `USER`);
- audit trail and full admin management.

## Stack

- Node.js, NestJS, TypeScript
- Prisma ORM, PostgreSQL
- LLMs: Ollama, OpenAI, Gemini/Google, Claude/Anthropic
- AWS S3 (LocalStack for local development)
- Docker Compose

## Current Architecture (overview)

- `backend/src/modules/auth`: register, login, refresh, logout, profile, guards.
- `backend/src/modules/admin`: admin CRUD for users, documents, invoices, audit data.
- `backend/src/modules/invoices`: upload, extraction, dashboards, role-aware listing.
- `backend/src/modules/llm`: dynamic provider selection and provider adapters.
- `backend/src/modules/storage`: JWE file encryption and S3 persistence.
- `backend/src/modules/audit`: audit log persistence.
- `backend/src/shared`: env/config, logger, HTTP response contract, filters, centralized messages.

## Configurable Extraction

Central extraction contract:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Main environment-driven extraction settings:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Security and Standards

- Global authentication on app routes (except public auth/health endpoints).
- RBAC with `ADMIN` and `USER`.
- Helmet global HTTP header policies.
- Global rate limiting via `@nestjs/throttler`.
- Centralized API response format (`success/error`).
- Centralized messages and logs in `backend/src/shared/messages/pt-br.messages.ts`.
- Logger levels (`LOG`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`) without `console`.

## Environment Convention

Use root environment files only:

- `/.env`
- `/.env.example`

## Run with Docker

From repository root:

```bash
docker compose up --build
```

To run the test suite in containers:

```bash
docker compose --profile test up --build backend-tests
```

Main services:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/api/health`
- PostgreSQL: `localhost:5432`
- Ollama: `http://localhost:11434`
- LocalStack (S3): `http://localhost:4566`

## Validation Checklist (backend scope)

- `npm run lint` in `backend`;
- `npm run test` in `backend` (unit + integration);
- `npm run build` in `backend`;
- `docker compose up --build` for infrastructure + API;
- `docker compose --profile test up --build backend-tests` for containerized tests.

## Practical Invoice Validation Script

Using a real challenge PDF, validate field by field:

- `numeroCliente`;
- `mesReferencia`;
- `itensFatura.energiaEletrica.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaSceeSemIcms.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaCompensadaGdi.{quantidadeKwh,valorRs}`;
- `itensFatura.contribIlumPublicaMunicipal.valorRs`.

Then validate computed metrics:

- `consumoEnergiaEletricaKwh`;
- `energiaCompensadaKwh`;
- `valorTotalSemGdRs`;
- `economiaGdRs`.

</details>
