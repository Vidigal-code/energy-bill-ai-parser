# Configuracion

El proyecto se controla por variables de entorno en el `.env` de raiz y se valida en `backend/src/shared/config/env.schema.ts`.

## Core y API

- `NODE_ENV`: `development|test|production`
- `PORT`: puerto del backend (default `3000`)
- `HELMET_ENABLED`: habilita cabeceras HTTP de seguridad
- `RATE_LIMIT_TTL_MS`: ventana de rate limit
- `RATE_LIMIT_LIMIT`: solicitudes por ventana
- `SWAGGER_ENABLED`: activa/desactiva Swagger
- `SWAGGER_PATH`: ruta de documentacion (default `api/docs`)
- `LOGS`: activa/desactiva logs del backend

## Base de datos

- `DATABASE_URL`: cadena de conexion PostgreSQL

Schema en `backend/prisma/schema.prisma` con:

- `User`, `RefreshToken`
- `Invoice`, `InvoiceMetrics`
- `StoredDocument`
- `AuditLog`

## Autenticacion y RBAC

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN` (default `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default `7d`)
- `JWT_ISSUER`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`

Roles:

- `ADMIN`: endpoints globales de gobernanza (`/api/admin/*`)
- `USER`: facturas/documentos propios y dashboards personales

## Configuracion de IA

- `OPEN_SOURCE_IA`: `true|false`
- `LLM_PROVIDER`: `ollama|openai|gemini|google|claude`

Detalles por provider:

- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- `OPENAI_BASE_URL`, `OPENAI_MODEL`, `OPENAI_API_KEY`
- `GEMINI_BASE_URL`, `GEMINI_MODEL`, `GEMINI_API_KEY`
- `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL`, `ANTHROPIC_API_KEY`

Personalizacion de extraccion:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Carga y almacenamiento

- `PDF_MAX_FILE_SIZE_MB`
- `ROLLBACK_ON_INVOICE_FAILURE`
- `JWE_SECRET` (minimo 32 caracteres)
- `STORAGE_DRIVER`: `aws|localstack`
- `S3_REGION`, `S3_BUCKET`
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`

## Runtime del frontend

- `FRONTEND_PORT` (mapeo de host por defecto `3001`)
- `BACKEND_API_URL` (llamadas server-side en Next)
- `NEXT_PUBLIC_BACKEND_API_URL` (URL API visible al navegador)

El frontend resuelve la URL de API en `frontend/src/shared/config/server-env.ts`.
