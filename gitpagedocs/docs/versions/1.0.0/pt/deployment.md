# Publicacao

O deploy pode ser feito via Docker Compose (recomendado) ou por servicos separados.

## Deploy com Docker Compose (caminho de referencia)

Na raiz do repositorio:

1. Garanta que `.env` existe com segredos de producao
2. Execute `docker compose up --build -d`
3. Valide saude:
   - `GET /api/health`
   - frontend em `/login`

Servicos iniciados:

- `postgres` (banco de dados)
- `localstack` (storage compativel com S3 para local/dev)
- `backend` (API NestJS)
- `frontend` (app Next.js)

Opcional:

- `backend-tests` com profile `test`
- `ollama` e `ollama-init` (comentados por padrao)

## Comportamento de startup do backend

O comando do container backend executa:

- `npx prisma db push`
- `node dist/src/main.js`

Isso sincroniza schema antes de servir a API.

## Checklist minimo de producao

- Defina valores fortes para `JWT_*` e `JWE_SECRET`
- Desative logs verbosos quando necessario (`LOGS=false`)
- Restrinja politica de CORS conforme dominio
- Use PostgreSQL gerenciado com credenciais seguras
- Use S3 real (`STORAGE_DRIVER=aws`) em cloud
- Armazene chaves de provider com seguranca (`GEMINI_API_KEY`, etc.)

## Fluxo recomendado de release

1. Build e testes de backend e frontend
2. Smoke test de extracao com fatura real
3. Deploy da stack
4. Validacoes pos-deploy:
   - fluxo de auth (`register/login/refresh/logout`)
   - extracao de fatura
   - valores de dashboards
   - endpoints administrativos

## Notas de escala horizontal

- A API e stateless (baseada em JWT), boa para multiplas instancias
- Dependencias compartilhadas devem ser externas:
  - PostgreSQL
  - storage compativel com S3
- Parametros de rate-limit devem refletir a carga real
