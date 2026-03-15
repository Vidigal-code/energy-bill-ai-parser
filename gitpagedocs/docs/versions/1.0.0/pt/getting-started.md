# Primeiros passos

Suba a plataforma completa (backend + frontend + infraestrutura) do zero.

## Pre-requisitos

- Node.js 20+
- npm 10+
- Docker Desktop (recomendado para stack completa)

## 1) Configure o ambiente

Na raiz do repositorio:

1. Copie `envexample.txt` para `.env`
2. Defina seus segredos e chaves de provider (pelo menos um provider)

Perfil recomendado para o desafio:

- `OPEN_SOURCE_IA=false`
- `LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=<sua_chave>`

## 2) Execute com Docker (recomendado)

Na raiz do repositorio:

1. `docker compose up --build`
2. Aguarde os healthchecks dos servicos
3. Acesse `http://localhost:3001`

Perfil opcional de testes:

- `docker compose --profile test up backend-tests --build`

## 3) Execute sem Docker (processos locais)

Backend (`/backend`):

1. `npm install`
2. `npx prisma db push`
3. `npm run start:dev`

Frontend (`/frontend`):

1. `npm install`
2. `npm run dev`

Mesmo sem Docker, voce precisa de PostgreSQL + storage compativel com S3 (ou LocalStack).

## 4) Primeiro fluxo funcional

1. Registre usuario no frontend (`/register`) ou em `POST /api/auth/register`
2. Faça login e envie um PDF real em `/invoices`
3. Valide retorno da extracao e dashboards
4. (Admin) revise os dados em `/admin`

## 5) Comandos de validacao

- Lint backend: `cd backend && npm run lint`
- Testes backend: `cd backend && npm run test`
- Build backend: `cd backend && npm run build`
- Lint frontend: `cd frontend && npm run lint`
- Build frontend: `cd frontend && npm run build`

## URLs locais uteis

- Frontend: `http://localhost:3001`
- API base: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/api/docs/en`
- Swagger PT: `http://localhost:3000/api/docs/pt`
