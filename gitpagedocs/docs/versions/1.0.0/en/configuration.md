# Configuration

The project is driven by environment variables in root `.env` and validated in `backend/src/shared/config/env.schema.ts`.

## Core and API

- `NODE_ENV`: `development|test|production`
- `PORT`: backend port (default `3000`)
- `HELMET_ENABLED`: enable secure HTTP headers
- `RATE_LIMIT_TTL_MS`: throttling window
- `RATE_LIMIT_LIMIT`: requests per window
- `SWAGGER_ENABLED`: toggle Swagger generation
- `SWAGGER_PATH`: docs path (default `api/docs`)
- `LOGS`: enable/disable backend logger output

## Database

- `DATABASE_URL`: PostgreSQL connection string

Schema is in `backend/prisma/schema.prisma` with:

- `User`, `RefreshToken`
- `Invoice`, `InvoiceMetrics`
- `StoredDocument`
- `AuditLog`

## Authentication and RBAC

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN` (default `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default `7d`)
- `JWT_ISSUER`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`

Roles:

- `ADMIN`: global governance endpoints (`/api/admin/*`)
- `USER`: own invoices/documents and dashboards

## AI provider settings

- `OPEN_SOURCE_IA`: `true|false`
- `LLM_PROVIDER`: `ollama|openai|gemini|google|claude`

Provider details:

- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- `OPENAI_BASE_URL`, `OPENAI_MODEL`, `OPENAI_API_KEY`
- `GEMINI_BASE_URL`, `GEMINI_MODEL`, `GEMINI_API_KEY`
- `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL`, `ANTHROPIC_API_KEY`

Extraction customization:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## File upload and storage

- `PDF_MAX_FILE_SIZE_MB`
- `ROLLBACK_ON_INVOICE_FAILURE`
- `JWE_SECRET` (minimum 32 chars)
- `STORAGE_DRIVER`: `aws|localstack`
- `S3_REGION`, `S3_BUCKET`
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`

## Frontend runtime

- `FRONTEND_PORT` (default host mapping `3001`)
- `BACKEND_API_URL` (server-side calls in Next)
- `NEXT_PUBLIC_BACKEND_API_URL` (browser-visible API URL)

Frontend resolves backend URL in `frontend/src/shared/config/server-env.ts`.
