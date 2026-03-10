# Frontend - Energy Bill Platform

<details open>
<summary><strong>Português (PT-BR)</strong></summary>

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

</details>

<details>
<summary><strong>English (EN)</strong></summary>

Next.js frontend with FSD architecture for full platform operation integrated with the backend.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS (light/dark green theme)
- Redux Toolkit (session/authentication state)
- React Query (server state)
- Axios (API client)

## Architecture (FSD)

- `src/app`: Next routes, layout, and API routes.
- `src/shared`: API clients, config, global store, base UI.
- `src/entities`: frontend domain contracts (`auth`, `invoice`, `admin`).
- `src/features`: reusable flows (login, signup, session).
- `src/widgets`: layout composition and application shell.

## Secure session (HTTP-only cookie)

- The frontend does not expose tokens in `localStorage`.
- Login/signup/refresh/logout use `src/app/api/auth/*` and set HTTP-only cookies.
- Authenticated requests go through `src/app/api/proxy/[...path]`, which:
  - injects `Authorization` with the access token;
  - attempts refresh on `401`;
  - updates session cookies automatically.

## Features

- Auth: login, signup, profile, logout, and transparent refresh.
- Invoices: upload/processing, listing, and document querying.
- Dashboards: energy (kWh) and financial (BRL).
- Admin: users, invoices, documents, and audit (with administrative operations).

## Local run

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```

## Docker

This frontend is orchestrated by the root `docker-compose.yml` and starts together with backend/infrastructure:

```bash
docker compose up --build
```

Default access:

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000`
- Swagger (English): `http://localhost:3000/api/docs/en`
- Swagger (Português): `http://localhost:3000/api/docs/pt`

</details>
