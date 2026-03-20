# Arquitetura e infraestrutura

Visão aprofundada da estrutura do **energy-bill-ai-parser** e interação entre serviços.

## Monorepo

- **Backend** (`backend/`): aplicação NestJS com limites modulares.
- **Frontend** (`frontend/`): Next.js App Router, estrutura feature-sliced.
- **Infra** (`docker-compose.yml`): Postgres, LocalStack opcional, contentores da app.

## Camadas backend

- **Apresentação**: controladores, DTOs, guards, pipes.
- **Domínio / aplicação**: casos de uso, contrato de extração, erros de domínio.
- **Infraestrutura**: Prisma, cliente S3, adaptadores LLM, integrações externas.

Preocupações transversais em `backend/src/shared` (config, logging, filtros).

## Camadas frontend

- **`app/`**: rotas, layouts, limites servidor/cliente.
- **`entities/`**, **`features/`**, **`widgets/`**: composição de UI e estado (Redux Toolkit + React Query).

A sessão usa rotas **Next.js** e cookies **HTTP-only** para a API.

## Serviços Docker Compose

Serviços típicos:

- **postgres** – base de dados principal.
- **backend** – API NestJS.
- **frontend** – Next.js.
- **localstack** (se ativo) – API compatível com S3.

Portas e variáveis estão em `docker-compose.yml` e `envexample.txt`.

## Execução LLM

- **Gemini** (muitas vezes predefinido) aceita **PDF diretamente** na API multimodal, alinhado ao requisito de não extrair texto antes do modelo.
- **Ollama** pode exigir **conversão de páginas do PDF para imagem** quando o modelo não aceita o MIME type `application/pdf`.

## Observabilidade

- Logging estruturado (sem `console` em caminhos de produção).
- Mensagens centralizadas para erros ao utilizador (`backend/src/shared/messages/pt-br.messages.ts`).

## Segurança e rede

- **Helmet** para cabeçalhos HTTP.
- **Throttler** para rate limiting global.
- **CORS** e cookies alinhados com a origem do frontend.

> Versão: 1.0.0
