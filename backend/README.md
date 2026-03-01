# Backend - Energy Bill AI Parser

<details>
<summary><strong>🇧🇷 Português</strong></summary>

## Objetivo

API NestJS para processar faturas de energia com LLM, persistir dados no PostgreSQL e expor endpoints REST.

## Stack

- Node.js, NestJS, TypeScript
- Prisma ORM, PostgreSQL
- Ollama (com suporte por config para OpenAI/Gemini/Claude)

## Estrutura importante (`src`)

- `main.ts`: bootstrap global (pipes, filtros, interceptors).
- `app.module.ts`: módulos raiz.
- `shared/config`: validação de env.
- `shared/http`: padrão central de resposta.
- `shared/logging`: logger central.
- `modules/health`: health check.
- `modules/llm`: seleção de provider por env.
- `modules/invoices/domain/contracts`: contrato de extração e cálculos.

## Padrão de resposta

- Sucesso: `{ success, path, timestamp, data }`
- Erro: `{ success, path, timestamp, error: { statusCode, message, details } }`

## Logs

- Centralizados em `shared/logging/api-logger.ts`
- Níveis: `LOG`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`
- Controle por env: `LOGS=true|false`

## Extração configurável

Arquivo de referência:

- `src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Variáveis:

- `INVOICE_EXTRACTION_REFERENCE` (JSON string)
- `INVOICE_EXTRACTION_PROMPT` (texto)

## Variáveis de ambiente principais

- `NODE_ENV`, `PORT`, `DATABASE_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `OPEN_SOURCE_IA`, `LLM_PROVIDER`
- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- `ROLLBACK_ON_INVOICE_FAILURE`
- `LOGS`

## Executar local

```bash
npm install
npm run lint
npm run build
npm run start:dev
```

Health:

- `GET http://localhost:3000/api/health`

## Executar com Docker

Na raiz do repositório:

```bash
docker compose up --build
```

</details>

<details>
<summary><strong>🇬🇧 English</strong></summary>

## Goal

NestJS API to process energy bill PDFs with LLM, persist data in PostgreSQL, and expose REST endpoints.

## Stack

- Node.js, NestJS, TypeScript
- Prisma ORM, PostgreSQL
- Ollama (config-ready for OpenAI/Gemini/Claude)

## Important structure (`src`)

- `main.ts`: global bootstrap (pipes, filters, interceptors).
- `app.module.ts`: root modules.
- `shared/config`: env validation.
- `shared/http`: centralized response contract.
- `shared/logging`: centralized logger.
- `modules/health`: health check.
- `modules/llm`: env-based provider selection.
- `modules/invoices/domain/contracts`: extraction contract and metrics.

## Response contract

- Success: `{ success, path, timestamp, data }`
- Error: `{ success, path, timestamp, error: { statusCode, message, details } }`

## Logging

- Centralized at `shared/logging/api-logger.ts`
- Levels: `LOG`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`
- Env toggle: `LOGS=true|false`

## Configurable extraction

Reference file:

- `src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Variables:

- `INVOICE_EXTRACTION_REFERENCE` (JSON string)
- `INVOICE_EXTRACTION_PROMPT` (text)

## Main environment variables

- `NODE_ENV`, `PORT`, `DATABASE_URL`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `OPEN_SOURCE_IA`, `LLM_PROVIDER`
- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- `ROLLBACK_ON_INVOICE_FAILURE`
- `LOGS`

## Run locally

```bash
npm install
npm run lint
npm run build
npm run start:dev
```

Health:

- `GET http://localhost:3000/api/health`

## Run with Docker

From repository root:

```bash
docker compose up --build
```

</details>
