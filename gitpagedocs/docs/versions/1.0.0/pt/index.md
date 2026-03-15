# Energy Bill AI Parser

Plataforma full-stack para processar faturas de energia em PDF com extracao por IA, autenticacao segura, RBAC, auditoria e armazenamento criptografado.

## O que este projeto entrega

- Upload de PDF e extracao estruturada de dados da fatura
- Suporte a multiplos provedores de IA (`gemini`, `openai`, `claude`, `ollama`)
- Calculo de metricas de negocio (energia e financeiro)
- Backend seguro com JWT + rotacao de refresh token + RBAC
- Area administrativa para usuarios, faturas, documentos e auditoria
- Frontend Next.js com sessao por cookie HTTP-only

## Stack de tecnologia

- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: Next.js (App Router), React, Redux Toolkit, React Query
- IA: Gemini, OpenAI, Claude, Ollama
- Storage: API S3 (`aws` ou `localstack`) + criptografia JWE
- Orquestracao: Docker Compose

## Modulos do produto

- `backend/src/modules/auth`: registro, login, refresh, logout, perfil
- `backend/src/modules/invoices`: fluxo de extracao, listagem, dashboards
- `backend/src/modules/admin`: CRUD privilegiado e governanca
- `backend/src/modules/llm`: adapters de provider e parser de resposta
- `backend/src/modules/storage`: armazenamento e recuperacao criptografados
- `backend/src/modules/audit`: persistencia da trilha de auditoria
- `frontend/src/app`: login, register, dashboard, invoices, profile, admin

## Principais URLs em desenvolvimento local

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000/api`
- Swagger (EN): `http://localhost:3000/api/docs/en`
- Swagger (PT): `http://localhost:3000/api/docs/pt`
- Health: `http://localhost:3000/api/health`

## Navegacao rapida

- Abra **Primeiros passos** para subir a stack completa do zero.
- Abra **Configuracao** para entender variaveis de ambiente e providers.
- Abra **Publicacao** para orientacoes de Docker e rollout em producao.
- Abra **Arquitetura** para mapa de modulos e fluxo de dados.
- Abra **Integracoes e extensibilidade** para providers, storage e tema UI.
- Abra **FAQ** para troubleshooting.
