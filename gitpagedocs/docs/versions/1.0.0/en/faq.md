# FAQ

## Why does login work but protected endpoints return 401?

Check:

- frontend calls are going through `api/proxy/[...path]`
- auth cookies are present and not blocked by browser policy
- refresh token is valid and not revoked
- backend and frontend are using compatible base URLs

## Why does invoice extraction fail?

Check:

- `LLM_PROVIDER` value and provider API key
- uploaded file is valid PDF and below `PDF_MAX_FILE_SIZE_MB`
- provider model exists (`GEMINI_MODEL`, `OPENAI_MODEL`, etc.)
- backend logs for provider response parsing errors

## Why are documents saved but not downloadable?

Check:

- `STORAGE_DRIVER` and `S3_*` settings
- bucket exists (`S3_BUCKET`)
- `JWE_SECRET` remains stable across restarts
- object path was not removed by rollback routines

## Why does the app start but DB operations fail?

Check:

- `DATABASE_URL` connectivity from backend container/process
- `npx prisma db push` completed successfully
- postgres healthcheck is passing
- schema and credentials are aligned with environment

## Why does admin data look empty?

Check:

- authenticated account has `ADMIN` role
- default admin bootstrap variables are set correctly
- filters (`fromDate`, `toDate`, `username`, pagination) are not too restrictive

## How can I run 100% local open-source AI?

1. Set `OPEN_SOURCE_IA=true`
2. Set `LLM_PROVIDER=ollama`
3. Uncomment `ollama` and `ollama-init` services in `docker-compose.yml`
4. Ensure model pull/init succeeds before extraction tests
