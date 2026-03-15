# Arquitetura

O repositorio segue um split de monorepo com aplicacoes `backend` e `frontend` separadas.

## Mapa do repositorio

- `backend/`: API NestJS com modulos por dominio
- `frontend/`: UI Next.js App Router com estrutura inspirada em FSD
- `docker-compose.yml`: orquestracao da aplicacao + infraestrutura
- `envexample.txt`: template oficial de variaveis

## Fronteiras de modulo no backend

- `auth`: ciclo de sessao, refresh, perfil, guards
- `invoices`: upload + extracao + dashboards
- `admin`: governanca de usuarios/faturas/documentos/auditoria
- `llm`: abstracao de providers e parser de retorno
- `storage`: criptografia JWE + adapter S3
- `audit`: registro de acoes sensiveis
- `health`: endpoint de liveness

Camada compartilhada (cross-cutting):

- `shared/config`: schema e parse de env
- `shared/http`: contrato de resposta, interceptors e filtro global
- `shared/prisma`: service/module do Prisma
- `shared/logging`: logger estruturado

## Ciclo da requisicao (API)

1. Requisicao entra no prefixo global `/api`
2. Guards globais aplicam JWT + roles (exceto `@Public`)
3. ValidationPipe valida e sanitiza payload
4. Service/use-case executa regra de negocio
5. Interceptor de sucesso padroniza resposta
6. Excecoes sao normalizadas pelo filtro global

## Fluxo de extracao da fatura

1. Usuario envia PDF em `POST /api/invoices/extract`
2. Tipo/tamanho do arquivo e validado (`PDF_MAX_FILE_SIZE_MB`)
3. Arquivo e criptografado com JWE
4. Conteudo criptografado e salvo em storage S3
5. Provider de IA configurado extrai os campos
6. Metricas de negocio sao calculadas
7. Fatura + metricas + metadados do documento sao persistidos
8. Log de auditoria e salvo; rollback pode ocorrer em falha

## Arquitetura do frontend

- Paginas: `login`, `register`, `dashboard`, `invoices`, `profile`, `admin`
- API routes:
  - `api/auth/*` para operacoes de sessao
  - `api/proxy/[...path]` para proxy autenticado
- Estrategia de sessao:
  - cookies HTTP-only para access/refresh tokens
  - refresh transparente em `401`

## Destaques do modelo de dados

- `User` com role e status ativo
- `RefreshToken` para controle de rotacao
- `Invoice` com campos extraidos e status
- `InvoiceMetrics` com KPIs calculados
- `StoredDocument` com object key/checksum
- `AuditLog` com ator, acao, status e contexto
