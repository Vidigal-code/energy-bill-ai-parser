# Primeros pasos

Levanta la plataforma completa (backend + frontend + infraestructura) desde cero.

## Requisitos

- Node.js 20+
- npm 10+
- Docker Desktop (recomendado para stack completa)

## 1) Configura el entorno

En la raiz del repositorio:

1. Copia `envexample.txt` a `.env`
2. Define tus secretos y llaves de provider (al menos un provider)

Perfil recomendado para el desafio:

- `OPEN_SOURCE_IA=false`
- `LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=<tu_clave>`

## 2) Ejecuta con Docker (recomendado)

En la raiz del repositorio:

1. `docker compose up --build`
2. Espera los healthchecks de los servicios
3. Abre `http://localhost:3001`

Perfil opcional de pruebas:

- `docker compose --profile test up backend-tests --build`

## 3) Ejecuta sin Docker (procesos locales)

Backend (`/backend`):

1. `npm install`
2. `npx prisma db push`
3. `npm run start:dev`

Frontend (`/frontend`):

1. `npm install`
2. `npm run dev`

Sin Docker tambien necesitas PostgreSQL + storage compatible S3 (o LocalStack).

## 4) Primer flujo funcional

1. Registra un usuario en frontend (`/register`) o `POST /api/auth/register`
2. Inicia sesion y sube un PDF real en `/invoices`
3. Valida salida de extraccion y dashboards
4. (Admin) revisa los registros en `/admin`

## 5) Comandos de validacion

- Lint backend: `cd backend && npm run lint`
- Tests backend: `cd backend && npm run test`
- Build backend: `cd backend && npm run build`
- Lint frontend: `cd frontend && npm run lint`
- Build frontend: `cd frontend && npm run build`

## URLs locales utiles

- Frontend: `http://localhost:3001`
- API base: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/api/docs/en`
- Swagger PT: `http://localhost:3000/api/docs/pt`
