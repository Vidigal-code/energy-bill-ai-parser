# Primeiros passos

Este guia leva-o de um clone limpo a um stack **energy-bill-ai-parser** em execução (API + web + PostgreSQL + LocalStack S3 opcional).

## Pré-requisitos

- **Node.js** 20+
- **npm** 10+ (ou gestor compatível)
- **Docker** e Docker Compose (recomendado para o stack completo)
- Chave **Gemini** (ou outro LLM configurado) para extração com visão de PDF em modo próximo de produção

## 1. Clone e ambiente

1. Clone o repositório.
2. Copie o ficheiro de exemplo:

   ```bash
   cp envexample.txt .env
   ```

3. Edite `.env` e defina pelo menos:

   - **Base de dados**: `DATABASE_URL` (PostgreSQL; o Compose fornece valores por defeito)
   - **JWT**: `JWT_SECRET` e refresh conforme o projeto
   - **LLM**: ex.: `GEMINI_API_KEY` (Gemini costuma ser o padrão para PDF nativo)
   - **Armazenamento**: S3; **LocalStack** em ambiente Docker local

Consulte `envexample.txt` e `backend/src/shared/config/env.schema.ts` para a lista completa.

## 2. Docker Compose (recomendado)

Na raiz do repositório (com `.env`):

```bash
docker compose up --build
```

Serviços típicos:

| Serviço | URL / porta |
|--------|-------------|
| Frontend (Next.js) | `http://localhost:3001` |
| API (NestJS) | `http://localhost:3000` |
| Swagger (PT) | `http://localhost:3000/api/docs/pt` |
| Swagger (EN) | `http://localhost:3000/api/docs/en` |
| Health | `http://localhost:3000/api/health` |
| PostgreSQL | `localhost:5432` (conforme Compose) |
| LocalStack (S3) | `http://localhost:4566` |

## 3. Sem Docker (desenvolvimento)

- **Backend**: dependências em `backend/`, migrações Prisma, Nest em modo dev.
- **Frontend**: dependências em `frontend/`, servidor Next (tipicamente porta `3001`).

Garanta PostgreSQL (e S3 opcional) alinhados com o `.env`.

## 4. Testes

Testes do backend via perfil Docker (ver `README.md` na raiz):

```bash
docker compose --profile test up backend-tests --build
```

## 5. Site de documentação (esta pasta)

Os artefactos Git Page Docs estão em `gitpagedocs/`. Para correr o site de docs localmente, use os scripts do `package.json` na raiz (ex.: `npm run dev` se estiver configurado).

> Versão: 1.0.0
