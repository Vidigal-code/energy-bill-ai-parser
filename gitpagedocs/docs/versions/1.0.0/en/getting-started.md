# Getting Started

Run the entire platform (backend + frontend + infrastructure) from zero.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (recommended for full stack)

## 1) Configure environment

At repository root:

1. Copy `envexample.txt` to `.env`
2. Set your secrets and provider keys (at least one provider)

Recommended challenge profile:

- `OPEN_SOURCE_IA=false`
- `LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=<your_key>`

## 2) Run with Docker (recommended)

At repository root:

1. `docker compose up --build`
2. Wait for service healthchecks
3. Open `http://localhost:3001`

Optional test profile:

- `docker compose --profile test up backend-tests --build`

## 3) Run without Docker (local processes)

Backend (`/backend`):

1. `npm install`
2. `npx prisma db push`
3. `npm run start:dev`

Frontend (`/frontend`):

1. `npm install`
2. `npm run dev`

You still need PostgreSQL + S3-compatible storage (or LocalStack).

## 4) First functional flow

1. Register a user in the frontend (`/register`) or `POST /api/auth/register`
2. Login and upload a real bill PDF in `/invoices`
3. Validate extraction output and dashboards
4. (Admin) review records in `/admin`

## 5) Validation commands

- Backend lint: `cd backend && npm run lint`
- Backend tests: `cd backend && npm run test`
- Backend build: `cd backend && npm run build`
- Frontend lint: `cd frontend && npm run lint`
- Frontend build: `cd frontend && npm run build`

## Useful local URLs

- Frontend: `http://localhost:3001`
- API base: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/api/docs/en`
- Swagger PT: `http://localhost:3000/api/docs/pt`
