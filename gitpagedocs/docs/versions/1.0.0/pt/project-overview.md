# Arquitetura do projeto

Arquitetura atual do `energy-bill-ai-parser` para a versao `1.0.0`.

## Estrutura do repositorio

- `backend/`: API NestJS
- `frontend/`: UI Next.js App Router
- `docker-compose.yml`: orquestracao da stack

## Modulos do backend

- `auth`: registro, login, refresh, logout, perfil
- `invoices`: upload, extracao, listagens, dashboards
- `admin`: governanca de usuarios, documentos, faturas e auditoria
- `llm`: abstracao de providers e parse de saida
- `storage`: JWE + adapters S3
- `audit`: trilha de acoes sensiveis
- `health`: endpoint de liveness

## Modulos do frontend

- Rotas: `login`, `register`, `dashboard`, `invoices`, `profile`, `admin`
- Sessao: cookies HTTP-only
- API routes: `api/auth/*` e `api/proxy/[...path]`

## Fluxo de dados (extracao)

1. Upload do PDF
2. Validacao (tipo + limite de tamanho)
3. Criptografia JWE
4. Armazenamento S3 compativel
5. Extracao IA por provider selecionado
6. Calculo de metricas
7. Persistencia + auditoria

## Modelo de seguranca

- JWT e RBAC (`ADMIN`, `USER`)
- Rotacao de refresh token
- Rate-limit global e headers Helmet
- Contrato padrao de resposta/erro
