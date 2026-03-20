# Visão geral do projeto

**energy-bill-ai-parser** é uma plataforma full-stack para carregar PDFs de faturas de energia, extrair dados estruturados com **vários provedores de LLM** e expor dashboards e administração com **autenticação JWT**, **RBAC** (`ADMIN` / `USER`), **auditoria** e **armazenamento cifrado** (JWE + backend compatível com S3).

## Objetivos

- Aceitar uploads de PDF e enviá-los ao pipeline de LLM (visão/documento) segundo o contrato de extração.
- Persistir resultados e métricas em **PostgreSQL** via **Prisma**.
- Fornecer UI **Next.js** alinhada com papéis e APIs.
- Manter segurança e observabilidade (Helmet, throttling, logs estruturados).

## Stack

| Camada | Tecnologia |
|--------|------------|
| API | NestJS, TypeScript |
| Web | Next.js (App Router), React, Redux Toolkit, React Query, Tailwind |
| Dados | PostgreSQL, Prisma ORM |
| IA | Gemini, OpenAI, Claude, Ollama (seleção dinâmica) |
| Armazenamento | API compatível com S3; **LocalStack** localmente |
| Criptografia | JWE para dados sensíveis em repouso |

## Estrutura do repositório (resumo)

- `backend/` – Módulos NestJS, schema Prisma, contratos de extração.
- `frontend/` – App Next.js (estilo FSD: `app`, `shared`, `entities`, `features`, `widgets`).
- `docker-compose.yml` – Postgres, serviços da app, LocalStack opcional.
- `gitpagedocs/` – Este site de documentação (Git Page Docs).

## Módulos backend (conceito)

| Módulo | Responsabilidade |
|--------|------------------|
| `auth` | Registo, login, refresh, logout, perfil, guards |
| `invoices` | Upload, orquestração da extração, dashboards, listagens por papel |
| `llm` | Seleção de provedor e adaptadores |
| `storage` | Cifra JWE e operações S3 |
| `admin` | CRUD administrativo e vistas operacionais |
| `audit` | Trilha de auditoria |
| `shared` | Config, logging, filtros, respostas HTTP, mensagens |

## Contrato de extração

Regras de negócio e campos esperados estão centralizados em:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Prompts e material de referência via variáveis de ambiente, por exemplo:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Modelo de segurança

- JWT em rotas protegidas (exceto auth/health públicas).
- **RBAC**: `ADMIN` vs `USER`.
- **Helmet** e **rate limiting** (Throttler) globais.

## Sessão no frontend

O browser fala com rotas Next.js que fazem proxy de cookies / sessão para a API (cookies HTTP-only), sem tokens de sessão em `localStorage`.

> Versão: 1.0.0
