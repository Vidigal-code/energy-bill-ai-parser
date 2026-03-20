# Primeros pasos

Esta guia levanta `energy-bill-ai-parser` desde cero.

## Requisitos

- Node.js 20+
- npm 10+
- Docker Desktop (recomendado)

## Configuracion de entorno

1. Copia `envexample.txt` a `.env`
2. Completa secrets y llaves de provider
3. Mantiene defaults para entorno local cuando sea posible

Perfil recomendado:

- `OPEN_SOURCE_IA=false`
- `LLM_PROVIDER=gemini`
- `GEMINI_API_KEY=<tu_clave>`

## Ejecutar con Docker

Desde la raiz:

```bash
docker compose up --build
```

URLs principales:

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000/api`
- Swagger EN: `http://localhost:3000/api/docs/en`
- Health: `http://localhost:3000/api/health`

## Ejecutar sin Docker

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

## Validacion basica

- `cd backend && npm run lint && npm run test`
- `cd frontend && npm run lint && npm run build`
