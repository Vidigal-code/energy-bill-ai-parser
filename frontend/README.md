# Frontend - Energy Bill Platform

Frontend Next.js com arquitetura FSD para operação da plataforma completa integrada ao backend.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (tema verde claro/escuro)
- Redux Toolkit (estado de sessão/autenticação)
- React Query (estado de servidor)
- Axios (client API)

## Arquitetura (FSD)

- `src/app`: rotas, layout e API routes do Next.
- `src/shared`: API clients, config, store global, UI base.
- `src/entities`: contratos de domínio no frontend (`auth`, `invoice`, `admin`).
- `src/features`: fluxos reutilizáveis (login, registro, sessão).
- `src/widgets`: composição de layout e shell da aplicação.

## Sessão segura (HTTP-only cookie)

- O frontend não expõe tokens em `localStorage`.
- Login/registro/refresh/logout usam `src/app/api/auth/*` e setam cookies HTTP-only.
- Chamadas autenticadas passam por `src/app/api/proxy/[...path]`, que:
  - injeta `Authorization` com access token;
  - tenta refresh em `401`;
  - atualiza cookies de sessão automaticamente.

## Funcionalidades

- Auth: login, registro, perfil, logout e refresh transparente.
- Invoices: upload/processamento, listagem e consulta de documentos.
- Dashboards: energia (kWh) e financeiro (R$).
- Admin: usuários, faturas, documentos e auditoria (com operações administrativas).

## Execução local

```bash
npm install
npm run dev
```

## Build e lint

```bash
npm run lint
npm run build
```

## Docker

Este frontend é orquestrado no `docker-compose.yml` da raiz e sobe junto com backend/infra:

```bash
docker compose up --build
```

Acesso padrão:

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000`
- Swagger (English): `http://localhost:3000/api/docs/en`
- Swagger (Português): `http://localhost:3000/api/docs/pt`
