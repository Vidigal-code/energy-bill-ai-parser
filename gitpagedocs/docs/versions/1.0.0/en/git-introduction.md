# Architecture and infrastructure

Deep dive into how **energy-bill-ai-parser** is structured and how services interact.

## Monorepo

- **Backend** (`backend/`): NestJS application, modular boundaries.
- **Frontend** (`frontend/`): Next.js App Router, feature-sliced structure.
- **Infra** (`docker-compose.yml`): Postgres, optional LocalStack, app containers.

## Backend layering

- **Presentation**: controllers, DTOs, guards, pipes.
- **Application / domain**: use cases, invoice extraction contract, domain errors.
- **Infrastructure**: Prisma, S3 client, LLM adapters, external integrations.

Key shared cross-cutting concerns live in `backend/src/shared` (config, logging, filters).

## Frontend layering

- **`app/`**: routes, layouts, server/client boundaries.
- **`entities/`**, **`features/`**, **`widgets/`**: UI composition and state (Redux Toolkit + React Query for server state).

Session is handled via **Next.js** routes and **HTTP-only cookies** toward the API.

## Docker Compose services

Typical services:

- **postgres** – primary database.
- **backend** – NestJS API.
- **frontend** – Next.js.
- **localstack** (if enabled) – S3 API compatibility.

Ports and env vars are documented in `docker-compose.yml` and `envexample.txt`.

## LLM execution notes

- **Gemini** (default in many setups) accepts PDF **directly** via multimodal API, matching the “no pre-extraction text pipeline” requirement.
- **Ollama** may require **image conversion** from PDF pages for vision models that do not support the PDF MIME type.

## Observability

- Structured logging (no raw `console` in production paths).
- Centralized messages for user-facing errors (PT-BR in `backend/src/shared/messages/pt-br.messages.ts`).

## Security and network

- **Helmet** for HTTP headers.
- **Throttler** for global rate limiting.
- **CORS** and cookie settings aligned with frontend origin.

> Version: 1.0.0
