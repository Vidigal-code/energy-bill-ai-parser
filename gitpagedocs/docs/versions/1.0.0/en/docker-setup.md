# Docker Setup & Environments

The absolute foundation of local deployments hangs upon the monolithic logic written inside the root `docker-compose.yml`.

## Bottled Services
Firing `docker compose up --build` generates an isolated bridge-network unifying these containers:
1. `backend`: Spins up NestJS and maps port `:3000`. Internally ships with core linux packages like `ghostscript` to allow deep PDF AI evaluations.
2. `frontend`: The Next.JS frontend bounding to node port `:3001`.
3. `postgres`: Seeds an initial SQL configuration and ties the persistence to a Docker Native Volume. Database tables won't flush when deleting the container.
4. `localstack`: Fully fakes the massive AWS ecosystem down into a localized footprint at `:4566`. Our `init-s3.sh` runs over its boot-up injecting our Invoices S3 Bucket offline.
5. `ollama` (Optional): Once un-commented, boots open-source offline language models bypassing Gemini entirely.
