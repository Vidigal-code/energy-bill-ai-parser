# Deployment

Production-ready deployment can run with Docker Compose or separated services.

## Docker Compose deployment (reference path)

At repository root:

1. Ensure `.env` exists and has production-safe secrets
2. Run `docker compose up --build -d`
3. Verify health:
   - `GET /api/health`
   - frontend `/login`

Services started:

- `postgres` (database)
- `localstack` (S3-compatible storage in local/dev scenarios)
- `backend` (NestJS API)
- `frontend` (Next.js app)

Optional:

- `backend-tests` with profile `test`
- `ollama` and `ollama-init` (commented by default)

## Backend startup behavior

The backend container command runs:

- `npx prisma db push`
- `node dist/src/main.js`

This means schema sync happens on startup before serving API.

## Minimum production checklist

- Set strong values for `JWT_*` and `JWE_SECRET`
- Disable verbose logs if needed (`LOGS=false`)
- Restrict CORS origin strategy if required
- Use managed PostgreSQL with secure credentials
- Use real S3 (`STORAGE_DRIVER=aws`) for cloud deployments
- Store provider keys securely (`GEMINI_API_KEY`, etc.)

## Suggested release workflow

1. Build and test backend and frontend
2. Run extraction smoke test with a real invoice
3. Deploy stack
4. Run post-deploy checks:
   - Auth flow (`register/login/refresh/logout`)
   - Invoice extraction
   - Dashboard values
   - Admin governance endpoints

## Horizontal scaling notes

- API is stateless (JWT-based), suitable for multiple instances
- Shared dependencies must be externalized:
  - PostgreSQL
  - S3-compatible storage
- Rate-limit settings should align with traffic profile
