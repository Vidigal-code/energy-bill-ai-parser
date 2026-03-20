# Project Architecture

Current architecture of `energy-bill-ai-parser` for version `1.0.0`.

## Repository layout

- `backend/`: NestJS API
- `frontend/`: Next.js App Router UI
- `docker-compose.yml`: infrastructure and app orchestration

## Backend modules

- `auth`: register, login, refresh, logout, profile
- `invoices`: upload, extraction, listings, dashboards
- `admin`: management of users, documents, invoices, audit logs
- `llm`: provider abstraction and parsing
- `storage`: JWE + S3-compatible adapters
- `audit`: action trail and governance
- `health`: service liveness endpoint

## Frontend modules

- Route pages: `login`, `register`, `dashboard`, `invoices`, `profile`, `admin`
- Session strategy: HTTP-only cookies
- API routes: `api/auth/*` and `api/proxy/[...path]`

## Data flow (invoice extraction)

1. PDF upload
2. Validation (type + max size)
3. JWE encryption
4. S3 storage
5. AI extraction by selected provider
6. Metric computation
7. Persistence + audit logging

## Security model

- JWT auth and RBAC (`ADMIN`, `USER`)
- Refresh token rotation
- Global rate-limit and helmet headers
- Standardized success/error response contract
