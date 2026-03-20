# Getting Started

This guide bootstraps `energy-bill-ai-parser` from zero.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (recommended)

## Environment setup

1. Copy `envexample.txt` to `.env`
2. Fill provider keys and secrets
3. Keep defaults for local stack when possible

Recommended profile:

- `OPEN_SOURCE_IA=false`
- `LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=<your_key>`

## Run with Docker

From repository root:

```bash
docker compose up --build
```

Main URLs:

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/api/docs/en`
- Health: `http://localhost:3000/api/health`

## Run without Docker

Backend:

```bash
cd backend
npm install
npx prisma db push
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Basic validation

- `cd backend && npm run lint && npm run test`
- `cd frontend && npm run lint && npm run build`
