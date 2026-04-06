# Project overview

**energy-bill-ai-parser** is a full-stack platform to upload energy-bill PDFs, extract structured data with **multiple LLM providers**, and expose dashboards and admin flows with **JWT authentication**, **RBAC** (`ADMIN` / `USER`), **audit logs**, and **encrypted storage** (JWE + S3-compatible backend).

## Goals

- Accept PDF uploads and send them to an LLM (vision/document) pipeline per your extraction contract.
- Persist structured results and business metrics in **PostgreSQL** via **Prisma**.
- Provide a **Next.js** UI aligned with backend roles and APIs.
- Keep security and observability consistent (Helmet, throttling, structured logging).

## Stack

| Layer | Technology |
|-------|------------|
| API | NestJS, TypeScript |
| Web | Next.js (App Router), React, Redux Toolkit, React Query, Tailwind |
| Data | PostgreSQL, Prisma ORM |
| AI | Gemini, OpenAI, Claude, Ollama (dynamic provider selection) |
| Storage | S3-compatible API; **LocalStack** locally |
| Crypto | JWE for sensitive payloads at rest |

## Repository layout (high level)

- `backend/` – NestJS modules, Prisma schema, extraction contracts.
- `frontend/` – Next.js app (FSD-style: `app`, `shared`, `entities`, `features`, `widgets`).
- `docker-compose.yml` – Postgres, app services, optional LocalStack.
- `gitpagedocs/` – This documentation site (Git Page Docs).

## Backend modules (conceptual)

| Module | Responsibility |
|--------|------------------|
| `auth` | Register, login, refresh, logout, profile, guards |
| `invoices` | Upload, extraction orchestration, dashboards, role-scoped listing |
| `llm` | Provider selection and per-provider adapters |
| `storage` | JWE encryption and S3 operations |
| `admin` | Administrative CRUD and operational views |
| `audit` | Audit trail persistence |
| `shared` | Config, logging, filters, standardized HTTP responses, messages |

## Extraction contract

Business rules and field expectations are centralized in the contract under:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Prompts and reference material are driven by environment variables such as:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Security model

- Global JWT authentication on protected routes (public auth/health routes excluded).
- **RBAC**: `ADMIN` vs `USER` for admin vs standard flows.
- **Helmet** for HTTP headers; **rate limiting** (Throttler) globally.

## Frontend session

The browser talks to Next.js route handlers that proxy cookies / session to the backend (HTTP-only cookies), not raw tokens in `localStorage` for session management.

> Version: 1.0.0
