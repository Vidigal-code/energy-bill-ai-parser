# Energy Bill AI Parser (Backend Focus)

API backend para processar faturas de energia em PDF, extrair dados estruturados com LLM e expor endpoints REST para consulta e dashboard.

<details>
<summary><strong>🇧🇷 Descrição em Português</strong></summary>

Este projeto implementa o desafio técnico com foco inicial no **backend** usando:

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Ollama (LLM open-source)
- Docker (orquestração)

### Regras de negócio do desafio (escopo atual)

A extração da fatura deve retornar, no mínimo:

- `numeroCliente`
- `mesReferencia`
- `itensFatura.energiaEletrica.quantidadeKwh`
- `itensFatura.energiaEletrica.valorRs`
- `itensFatura.energiaSceeSemIcms.quantidadeKwh`
- `itensFatura.energiaSceeSemIcms.valorRs`
- `itensFatura.energiaCompensadaGdi.quantidadeKwh`
- `itensFatura.energiaCompensadaGdi.valorRs`
- `itensFatura.contribIlumPublicaMunicipal.valorRs`

Variáveis calculadas (regra do desafio):

- `consumoEnergiaEletricaKwh = energiaEletrica.kwh + energiaSceeSemIcms.kwh`
- `energiaCompensadaKwh = energiaCompensadaGdi.kwh`
- `valorTotalSemGdRs = energiaEletrica.rs + energiaSceeSemIcms.rs + contribIlumPublicaMunicipal.rs`
- `economiaGdRs = energiaCompensadaGdi.rs`

### Extração configurável (reutilizável para qualquer fatura)

A referência de extração está centralizada em TypeScript:

- `backend/src/modules/invoices/contracts/invoice-extraction.contract.ts`

Nesse arquivo ficam:

- schema de validação da extração;
- tipagem canônica dos dados;
- referência dos campos obrigatórios;
- prompt-base de extração;
- cálculo das métricas de negócio.

Isso permite evoluir para diferentes concessionárias e layouts de fatura, alterando o contrato de extração de forma centralizada.

### Estratégia de provedores de IA

A seleção de IA é controlada por variáveis de ambiente:

- `OPEN_SOURCE_IA=true` -> prioriza `ollama`;
- `OPEN_SOURCE_IA=false` + `LLM_PROVIDER=openai|gemini|claude`.

### Configuração de ambiente (sempre na raiz)

Este repositório usa **somente**:

- `/.env` (local)
- `/.env.example` (template)

Não usar `backend/.env`.

### Como rodar com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Serviços:

- API: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`
- PostgreSQL: `localhost:5432`
- Ollama: `http://localhost:11434`

</details>

<details>
<summary><strong>🇬🇧 English Description</strong></summary>

Backend API to process utility bill PDFs, extract structured data using LLMs, and expose REST endpoints for listing and dashboard metrics.

### Current stack

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Ollama (open-source LLM)
- Docker

### Business rules currently covered

The extraction contract requires:

- customer number
- reference month
- electric energy (kWh + BRL)
- SCEE without ICMS (kWh + BRL)
- compensated GD energy (kWh + BRL)
- municipal public lighting fee (BRL)

Computed metrics:

- total electric consumption (kWh)
- compensated energy (kWh)
- total amount without GD (BRL)
- GD savings (BRL)

### Configurable extraction contract

The extraction is centralized in:

- `backend/src/modules/invoices/contracts/invoice-extraction.contract.ts`

This file is the reusable source of truth for:

- required extracted fields
- extraction schema and types
- base prompt for LLM providers
- business metrics computation

It allows adapting extraction logic for different invoice layouts while keeping a stable backend contract.

### Environment convention

Use root-level files only:

- `/.env`
- `/.env.example`

No `backend/.env`.

</details>
