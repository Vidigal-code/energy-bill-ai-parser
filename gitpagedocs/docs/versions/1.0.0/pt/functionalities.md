# Funcionalidades

Mapa funcional do `energy-bill-ai-parser`.

## Autenticacao

- Registro e login de usuario
- Fluxo de refresh token e logout seguro
- Perfil do usuario autenticado
- Controle por papel (`ADMIN`, `USER`)

## Processamento de faturas

- Endpoint de upload de PDF
- Extracao com abstracao de providers IA:
  - `gemini`
  - `openai`
  - `claude`
  - `ollama`
- Normalizacao de saida estruturada
- Historico persistido com filtros

## Dashboards

- Dashboard de energia (`kWh`)
- Dashboard financeiro (`R$`)
- Dashboard consolidado

## Administracao

- Gestao de usuarios
- Governanca de faturas e documentos
- Consulta de logs de auditoria
- Download e exclusao segura de documentos

## Storage e auditoria

- Documento criptografado (JWE)
- Armazenamento em bucket S3 compativel
- Rastreabilidade de operacoes sensiveis

## API + Docs + codigo

- Swagger em EN/PT
- Endpoint health para observabilidade
- Rota de visualizacao de codigo nesta versao
