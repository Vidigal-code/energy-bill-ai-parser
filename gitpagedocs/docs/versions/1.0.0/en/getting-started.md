# Getting started

This guide takes you from a fresh clone to a running **energy-bill-ai-parser** stack (API + web + PostgreSQL + optional LocalStack S3).

## Prerequisites

- **Node.js** 20+
- **npm** 10+ (or compatible package manager)
- **Docker** and Docker Compose (recommended for full stack)
- A **Gemini API key** (or another configured LLM provider) if you want PDF vision extraction in production-like mode

## 1. Clone and environment

1. Clone the repository.
2. Copy the example environment file:

   ```bash
   cp envexample.txt .env
   ```

3. Edit `.env` and set at least:

   - **Database**: `DATABASE_URL` (PostgreSQL; Docker Compose provides defaults)
   - **JWT**: `JWT_SECRET`, refresh secret if applicable
   - **LLM**: e.g. `GEMINI_API_KEY` (default provider is often Gemini for native PDF upload)
   - **Storage**: S3-compatible settings; LocalStack is used locally when `docker-compose` is used

See `envexample.txt` and `backend/src/shared/config/env.schema.ts` for the full list of variables.

## 2. Run with Docker Compose (recommended)

From the repository root (with `.env` present):

```bash
docker compose up --build
```

Typical services:

| Service | URL / port |
|--------|------------|
| Frontend (Next.js) | `http://localhost:3001` |
| Backend API (NestJS) | `http://localhost:3000` |
| Swagger (PT) | `http://localhost:3000/api/docs/pt` |
| Swagger (EN) | `http://localhost:3000/api/docs/en` |
| Health | `http://localhost:3000/api/health` |
| PostgreSQL | `localhost:5432` (per Compose env) |
| LocalStack (S3) | `http://localhost:4566` |

## 3. Run without Docker (development)

- **Backend**: install dependencies in `backend/`, run Prisma migrations, start Nest (`npm run start:dev` or as documented in `backend/README.md`).
- **Frontend**: install in `frontend/`, start Next.js dev server (typically port `3001`).

Ensure PostgreSQL (and optional S3) match your `.env`.

## 4. Tests

Backend tests can be run via Docker profile (see root `README.md`):

```bash
docker compose --profile test up backend-tests --build
```

## 5. Documentation site (this folder)

Git Page Docs assets live under `gitpagedocs/`. To run the docs app locally, follow the root `package.json` scripts (e.g. `npm run dev` at repo root if configured).

> Version: 1.0.0
