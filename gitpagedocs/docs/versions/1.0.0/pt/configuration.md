# Configuracao

O projeto e dirigido por variaveis de ambiente no `.env` da raiz e validadas em `backend/src/shared/config/env.schema.ts`.

## Core e API

- `NODE_ENV`: `development|test|production`
- `PORT`: porta do backend (padrao `3000`)
- `HELMET_ENABLED`: habilita headers HTTP de seguranca
- `RATE_LIMIT_TTL_MS`: janela do rate limit
- `RATE_LIMIT_LIMIT`: requisicoes por janela
- `SWAGGER_ENABLED`: liga/desliga Swagger
- `SWAGGER_PATH`: caminho da doc (padrao `api/docs`)
- `LOGS`: liga/desliga logs do backend

## Banco de dados

- `DATABASE_URL`: string de conexao PostgreSQL

Schema em `backend/prisma/schema.prisma` com:

- `User`, `RefreshToken`
- `Invoice`, `InvoiceMetrics`
- `StoredDocument`
- `AuditLog`

## Autenticacao e RBAC

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN` (padrao `15m`)
- `JWT_REFRESH_EXPIRES_IN` (padrao `7d`)
- `JWT_ISSUER`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`

Papeis:

- `ADMIN`: endpoints globais de governanca (`/api/admin/*`)
- `USER`: faturas/documentos proprios e dashboards pessoais

## Configuracao de IA

- `OPEN_SOURCE_IA`: `true|false`
- `LLM_PROVIDER`: `ollama|openai|gemini|google|claude`

Detalhes por provider:

- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- `OPENAI_BASE_URL`, `OPENAI_MODEL`, `OPENAI_API_KEY`
- `GEMINI_BASE_URL`, `GEMINI_MODEL`, `GEMINI_API_KEY`
- `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL`, `ANTHROPIC_API_KEY`

Personalizacao da extracao:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Upload e armazenamento

- `PDF_MAX_FILE_SIZE_MB`
- `ROLLBACK_ON_INVOICE_FAILURE`
- `JWE_SECRET` (minimo 32 caracteres)
- `STORAGE_DRIVER`: `aws|localstack`
- `S3_REGION`, `S3_BUCKET`
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`

## Runtime do frontend

- `FRONTEND_PORT` (mapeamento de host padrao `3001`)
- `BACKEND_API_URL` (chamadas server-side no Next)
- `NEXT_PUBLIC_BACKEND_API_URL` (URL de API exposta ao browser)

O frontend resolve URL da API em `frontend/src/shared/config/server-env.ts`.
