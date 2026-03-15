# Architecture

The repository follows a monorepo-style split with independent `backend` and `frontend` applications.

## Repository map

- `backend/`: NestJS API with modular domain boundaries
- `frontend/`: Next.js App Router UI with FSD-inspired structure
- `docker-compose.yml`: orchestration for app + infrastructure
- `envexample.txt`: canonical environment template

## Backend module boundaries

- `auth`: session lifecycle, refresh rotation, profile, guards
- `invoices`: upload + extraction workflow + dashboards
- `admin`: privileged management for users/invoices/documents/audit
- `llm`: provider abstraction and output parsing
- `storage`: JWE encryption + S3 adapter
- `audit`: action logging for sensitive operations
- `health`: liveness endpoint

Cross-cutting shared layer:

- `shared/config`: env schema and parsing
- `shared/http`: response contract, interceptors, exception filter
- `shared/prisma`: Prisma service/module
- `shared/logging`: structured logger

## Request lifecycle (API)

1. Incoming request goes through global prefix `/api`
2. Global guards enforce JWT auth + roles (except `@Public`)
3. Validation pipe sanitizes and validates payloads
4. Module service/use-case executes domain logic
5. Success interceptor wraps output in standard response contract
6. Exceptions are normalized by global filter

## Invoice extraction flow

1. User uploads PDF to `POST /api/invoices/extract`
2. File type/size is validated (`PDF_MAX_FILE_SIZE_MB`)
3. File is encrypted with JWE
4. Encrypted payload is stored in S3-compatible storage
5. Configured LLM provider extracts structured fields
6. Business metrics are calculated
7. Invoice + metrics + document metadata are persisted
8. Audit record is written; rollback may run on failure

## Frontend architecture

- Pages: `login`, `register`, `dashboard`, `invoices`, `profile`, `admin`
- API routes:
  - `api/auth/*` for session operations
  - `api/proxy/[...path]` for authenticated forwarding
- Session strategy:
  - HTTP-only cookies for access/refresh tokens
  - transparent refresh on `401`

## Data model highlights

- `User` with role and active status
- `RefreshToken` for token rotation tracking
- `Invoice` with extracted fields and status
- `InvoiceMetrics` for computed KPIs
- `StoredDocument` with object key/checksum metadata
- `AuditLog` with actor, action, status, and context
