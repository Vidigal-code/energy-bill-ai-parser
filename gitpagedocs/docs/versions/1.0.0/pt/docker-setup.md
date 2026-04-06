# Configuração Docker

A magia principal no ambiente de desenvolvimento da Aplicação ocorre graças ao `docker-compose.yml` que emula tudo.

## Serviços Empacotados no Compose
O comando global inicial é `docker compose up --build`. Ele constrói uma rede interna isolada (bridge network) englobando:
1. `backend`: Roda o NestJS escutando a porta `:3000`. Embuti emuladores de compilação PDF como *ghostscript/graphicsmagick*.
2. `frontend`: Next.js Node app linkado estaticamente na porta `:3001`.
3. `postgres`: Cria o cluster do PostgreSQL inicial e mapeia um Volume Nativo Docker para não perder dados a cada rebote ou interrupção de container.
4. `localstack`: Simula toda a gigante nuvem (AWS) injetando a funcionalidade de objeto (S3) local, expondo a API via `:4566`. Utilizamos um script chamado `init-s3.sh` para criação automática do bucket.
5. `ollama` (Opcional): Se habilitado no arquivo `.yml` com as flags de rede, traz Inteligência Artificial visual generativa Llama offline.
