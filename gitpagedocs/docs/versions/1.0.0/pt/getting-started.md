# Primeiros passos

Este guia sobe o `energy-bill-ai-parser` do zero.

## Requisitos

- Node.js 20+
- npm 10+
- Docker Desktop (recomendado)

## Configuracao de ambiente

1. Copie `envexample.txt` para `.env`
2. Preencha as chaves e segredos dos providers
3. Mantenha os defaults para ambiente local quando possivel

Perfil recomendado:

- `OPEN_SOURCE_IA=false`
- `LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=<sua_chave>`

## Executar com Docker

Na raiz do repositorio:

```bash
docker compose up --build
```

URLs principais:

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/api/docs/en`
- Health: `http://localhost:3000/api/health`

## Executar sem Docker

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

## Validacao basica

- `cd backend && npm run lint && npm run test`
- `cd frontend && npm run lint && npm run build`
