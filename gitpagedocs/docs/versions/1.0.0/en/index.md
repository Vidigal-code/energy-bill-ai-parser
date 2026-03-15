# Energy Bill AI Parser

Full-stack platform to process energy bill PDFs with AI extraction, secure auth, RBAC, audit trail, and encrypted document storage.

## What this project delivers

- PDF upload and structured extraction from utility bills
- Multi-provider LLM support (`gemini`, `openai`, `claude`, `ollama`)
- Business metrics calculation (energy and financial KPIs)
- Secure backend with JWT + refresh token rotation + RBAC
- Admin area for users, invoices, documents, and audit logs
- Next.js frontend with HTTP-only cookie session flow

## Technology stack

- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: Next.js (App Router), React, Redux Toolkit, React Query
- AI: Gemini, OpenAI, Claude, Ollama
- Storage: S3 API (`aws` or `localstack`) + JWE encryption
- Orchestration: Docker Compose

## Product modules

- `backend/src/modules/auth`: register, login, refresh, logout, profile
- `backend/src/modules/invoices`: extraction workflow, listing, dashboards
- `backend/src/modules/admin`: privileged CRUD and governance endpoints
- `backend/src/modules/llm`: provider adapters and extraction parser
- `backend/src/modules/storage`: encrypted file storage and retrieval
- `backend/src/modules/audit`: audit trail persistence
- `frontend/src/app`: login, register, dashboard, invoices, profile, admin

## Main URLs in local development

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000/api`
- Swagger (EN): `http://localhost:3000/api/docs/en`
- Swagger (PT): `http://localhost:3000/api/docs/pt`
- Health: `http://localhost:3000/api/health`

## Quick navigation

- Open **Getting Started** to run the full stack from zero.
- Open **Configuration** to understand environment variables and providers.
- Open **Deployment** for Docker and production rollout guidance.
- Open **Architecture** for module map and request/data flow.
- Open **Integrations and Extensibility** for providers, storage, and UI theming.
- Open **FAQ** for troubleshooting.
