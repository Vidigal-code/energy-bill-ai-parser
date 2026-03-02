# Energy Bill AI Parser

Plataforma full-stack para processamento de faturas de energia com IA, autenticação segura, RBAC, auditoria e armazenamento criptografado.

<details>
<summary><strong>🇧🇷 Descrição em Português</strong></summary>

## Objetivo atual

O repositório entrega backend + frontend para:

- upload de PDF;
- extração estruturada com múltiplos provedores de IA;
- cálculo de métricas de negócio;
- persistência com Prisma/PostgreSQL;
- controle de acesso com JWT + RBAC (`ADMIN` e `USER`);
- trilha de auditoria e gestão administrativa completa;
- experiência web em Next.js integrada ao backend.

## Stack

- Node.js, NestJS, TypeScript
- Next.js, React, Redux Toolkit, React Query, Axios, Tailwind CSS
- Prisma ORM, PostgreSQL
- LLMs: Ollama, OpenAI, Gemini/Google, Claude/Anthropic
- AWS S3 (LocalStack no ambiente local)
- Docker Compose

## Arquitetura atual (resumo)

- `backend/src/modules/auth`: registro, login, refresh token, logout, perfil e guards.
- `backend/src/modules/admin`: CRUD administrativo de usuários, documentos, faturas e auditoria.
- `backend/src/modules/invoices`: upload, extração, dashboards e listagem por papel.
- `backend/src/modules/llm`: seleção dinâmica de provider e adapters por provedor.
- `backend/src/modules/storage`: criptografia JWE e armazenamento S3.
- `backend/src/modules/audit`: persistência de logs de auditoria.
- `backend/src/shared`: config/env, logger, resposta HTTP padrão, filtros e mensagens centralizadas.
- `frontend/src`: arquitetura FSD (`app`, `shared`, `entities`, `features`, `widgets`) com sessão HTTP-only cookie via rotas internas.

## Extração configurável

Contrato central de extração:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Configuração principal via variáveis de ambiente:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Decisões Arquiteturais e Tecnologias

- **Framework Backend (NestJS)**: Escolhido pela arquitetura modular, injeção de dependências e suporte nativo ao TypeScript, garantindo escalabilidade e testabilidade.
- **ORM (Prisma)**: Facilita a modelagem relacional dos dados estruturados extraídos, com tipagem fortemente vinculada ao banco PostgreSQL.
- **LLM Escolhido (Gemini)**: Conforme o requisito estrito do desafio, era obrigatório o envio direto do **próprio arquivo PDF** para análise visão/documento do LLM (sem usar bibliotecas de extração de texto estruturado). Modelos Open-Source como `llama3.2-vision` (Ollama) não suportam o recebimento de PDFs de forma nativa através da API (aceitando apenas imagens binárias individuais no array de `images`). 
  
  Por esse motivo, **Gemini foi eleito como padrão** na aplicação e no Docker, pois sua API aceita o mimeType `application/pdf` diretamente na camada multimodal, aderindo 100% aos requisitos de não manipular o documento antes do envio.
- **Suporte Open-Source (Ollama)**: O projeto **DÁ SUPORTE COMPLETO** a IA Local e Open-Source. Caso deseje utilizar o Ollama, altere no `.env` a flag `OPEN_SOURCE_IA=true` e `LLM_PROVIDER=ollama`. Ao detectar esse provider configurado, o adaptador interno `OllamaExtractor` fará automaticamente o fallback convertendo a primeira página do PDF para uma imagem (usando `pdf2pic` / `ghostscript` incluídos no Docker) para viabilizar o envio visual ao LLM local, mantendo a não dependência de extração de *textos*, focando estritamente em imagem/visão.

## Segurança e padrões

- Rotas protegidas por autenticação global (exceto rotas públicas de auth/health).
- RBAC com `ADMIN` e `USER`.
- Helmet com políticas globais de cabeçalho HTTP.
- Rate limit global com `@nestjs/throttler`.
- Respostas centralizadas em formato padrão (`success/error`).
- Mensagens e logs centralizados em `backend/src/shared/messages/pt-br.messages.ts`.
- Logger sem `console`, com níveis (`LOG`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`).

## 🛠 Ambiente

Para rodar o projeto, configure as variáveis de ambiente abaixo.

Se quiser utilizar **análise de visão de PDF (100%)**, insira sua chave da API do Gemini:

```
GEMINI_API_KEY=sua_chave_aqui
```

### 📄 Arquivos importantes

* `.env` → Arquivo final com suas variáveis configuradas
* `envexample.txt` → Arquivo de exemplo para basear sua configuração

> 💡 Dica: renomeie `envexample.txt` para `.env` e preencha com suas informações.

---

## 🐳 Execução com Docker

Na raiz do projeto, certifique-se de que o arquivo esteja nomeado como `.env`.

Depois, execute:

```bash
docker compose up --build
```

Isso irá:

* Construir a imagem
* Criar os containers
* Iniciar a aplicação

Executar suíte de testes em container (profile dedicado):

```bash
docker compose --profile test up backend-tests --build
```

Serviços principais:

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000`
- Swagger (Português): `http://localhost:3000/api/docs/pt`
- Swagger (English): `http://localhost:3000/api/docs/en`
- Health: `http://localhost:3000/api/health`
- PostgreSQL: `localhost:5432`
- LocalStack (S3): `http://localhost:4566`

> **Ollama**: Os serviços locais do Ollama (`ollama` e `ollama-init`) vêm **comentados por padrão** no `docker-compose.yml` para economizar recursos da máquina, já que a aplicação está configurada para usar a API ultra rápida e com suporte nativo a PDF do **Gemini** para o desafio. Se desejar rodar a IA 100% local, basta descomentar esses blocos no docker-compose e ajustar o `.env` (`OPEN_SOURCE_IA=true`).

## Checklist de validação (escopo backend)

- `npm run lint` em `backend`;
- `npm run test` em `backend` (unitário + integração);
- `npm run build` em `backend`;
- `npm run lint` em `frontend`;
- `npm run build` em `frontend`;
- `docker compose up --build` para infraestrutura + API + frontend;
- `docker compose --profile test up backend-tests --build` para testes em container.

## Roteiro de validação prática (fatura)

Com um PDF real do desafio, validar campo a campo:

- `numeroCliente`;
- `mesReferencia`;
- `itensFatura.energiaEletrica.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaSceeSemIcms.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaCompensadaGdi.{quantidadeKwh,valorRs}`;
- `itensFatura.contribIlumPublicaMunicipal.valorRs`.

E validar métricas calculadas:

- `consumoEnergiaEletricaKwh`;
- `energiaCompensadaKwh`;
- `valorTotalSemGdRs`;
- `economiaGdRs`.

Evidência de referência (fatura exemplo JAN/2024):

- `numeroCliente`: `7204076116`
- `mesReferencia`: `JAN/2024`
- `energiaEletrica`: `50 kWh` / `R$ 47,75`
- `energiaSceeSemIcms`: `456 kWh` / `R$ 232,42`
- `energiaCompensadaGdi`: `456 kWh` / `R$ -222,22`
- `contribIlumPublicaMunicipal`: `R$ 49,43`
- `consumoEnergiaEletricaKwh`: `506`
- `energiaCompensadaKwh`: `456`
- `valorTotalSemGdRs`: `329,60`
- `economiaGdRs`: `-222,22`

</details>

<details>
<summary><strong>🇬🇧 English Description</strong></summary>

## Current Goal

The repository currently delivers backend + frontend to provide:

- PDF upload;
- structured extraction with multiple AI providers;
- business metrics computation;
- Prisma/PostgreSQL persistence;
- secure auth and RBAC (`ADMIN` and `USER`);
- audit trail and full admin management;
- full web experience in Next.js integrated to backend services.

## Stack

- Node.js, NestJS, TypeScript
- Next.js, React, Redux Toolkit, React Query, Axios, Tailwind CSS
- Prisma ORM, PostgreSQL
- LLMs: Ollama, OpenAI, Gemini/Google, Claude/Anthropic
- AWS S3 (LocalStack for local development)
- Docker Compose

## Current Architecture (overview)

- `backend/src/modules/auth`: register, login, refresh, logout, profile, guards.
- `backend/src/modules/admin`: admin CRUD for users, documents, invoices, audit data.
- `backend/src/modules/invoices`: upload, extraction, dashboards, role-aware listing.
- `backend/src/modules/llm`: dynamic provider selection and provider adapters.
- `backend/src/modules/storage`: JWE file encryption and S3 persistence.
- `backend/src/modules/audit`: audit log persistence.
- `backend/src/shared`: env/config, logger, HTTP response contract, filters, centralized messages.
- `frontend/src`: FSD architecture (`app`, `shared`, `entities`, `features`, `widgets`) with HTTP-only cookie session using Next route handlers.

## Configurable Extraction

Central extraction contract:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Main environment-driven extraction settings:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Security and Standards

- Global authentication on app routes (except public auth/health endpoints).
- RBAC with `ADMIN` and `USER`.
- Helmet global HTTP header policies.
- Global rate limiting via `@nestjs/throttler`.
- Centralized API response format (`success/error`).
- Centralized messages and logs in `backend/src/shared/messages/pt-br.messages.ts`.
- Logger levels (`LOG`, `INFO`, `WARNING`, `SUCCESS`, `ERROR`) without `console`.

## Environment Convention

Use root environment files only:

- `/.env`
- `/.env.example`

## Run with Docker

From repository root:

```bash
docker compose up --build
```

Run containerized test suite (dedicated profile):

```bash
docker compose --profile test up backend-tests --build
```

Main services:

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000`
- Swagger (Português): `http://localhost:3000/api/docs/pt`
- Swagger (English): `http://localhost:3000/api/docs/en`
- Health: `http://localhost:3000/api/health`
- PostgreSQL: `localhost:5432`
- LocalStack (S3): `http://localhost:4566`

> **Ollama**: Local Ollama services (`ollama` and `ollama-init`) are **commented out by default** in `docker-compose.yml` to save machine resources, since the application is configured to use the ultra-fast **Gemini** API (native PDF support) for the challenge. If you wish to run a 100% local AI, simply uncomment these blocks in `docker-compose.yml` and adjust the `.env` file (`OPEN_SOURCE_IA=true`).

## Validation Checklist (backend scope)

- `npm run lint` in `backend`;
- `npm run test` in `backend` (unit + integration);
- `npm run build` in `backend`;
- `npm run lint` in `frontend`;
- `npm run build` in `frontend`;
- `docker compose up --build` for infrastructure + API + frontend;
- `docker compose --profile test up backend-tests --build` for containerized tests.

## Practical Invoice Validation Script

Using a real challenge PDF, validate field by field:

- `numeroCliente`;
- `mesReferencia`;
- `itensFatura.energiaEletrica.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaSceeSemIcms.{quantidadeKwh,valorRs}`;
- `itensFatura.energiaCompensadaGdi.{quantidadeKwh,valorRs}`;
- `itensFatura.contribIlumPublicaMunicipal.valorRs`.

Then validate computed metrics:

- `consumoEnergiaEletricaKwh`;
- `energiaCompensadaKwh`;
- `valorTotalSemGdRs`;
- `economiaGdRs`.

Reference evidence (sample invoice JAN/2024):

- `numeroCliente`: `7204076116`
- `mesReferencia`: `JAN/2024`
- `energiaEletrica`: `50 kWh` / `R$ 47,75`
- `energiaSceeSemIcms`: `456 kWh` / `R$ 232,42`
- `energiaCompensadaGdi`: `456 kWh` / `R$ -222,22`
- `contribIlumPublicaMunicipal`: `R$ 49,43`
- `consumoEnergiaEletricaKwh`: `506`
- `energiaCompensadaKwh`: `456`
- `valorTotalSemGdRs`: `329,60`
- `economiaGdRs`: `-222,22`

</details>
