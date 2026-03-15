# FAQ

## Por que login funciona pero endpoints protegidos devuelven 401?

Verifica:

- llamadas frontend pasando por `api/proxy/[...path]`
- cookies de auth presentes y no bloqueadas por navegador
- refresh token valido y no revocado
- backend y frontend usando URLs base compatibles

## Por que falla la extraccion de factura?

Verifica:

- valor de `LLM_PROVIDER` y API key correspondiente
- archivo subido es PDF valido y menor a `PDF_MAX_FILE_SIZE_MB`
- modelo configurado existe (`GEMINI_MODEL`, `OPENAI_MODEL`, etc.)
- logs backend para errores de parse del provider

## Por que documentos se guardan pero no se descargan?

Verifica:

- `STORAGE_DRIVER` y configuracion `S3_*`
- bucket existente (`S3_BUCKET`)
- `JWE_SECRET` estable entre reinicios
- objeto no eliminado por rutina de rollback

## Por que la aplicacion inicia pero fallan operaciones de DB?

Verifica:

- conectividad de `DATABASE_URL` desde backend
- ejecucion correcta de `npx prisma db push`
- healthcheck de postgres en estado OK
- schema y credenciales alineados al entorno

## Por que datos admin aparecen vacios?

Verifica:

- cuenta autenticada tiene rol `ADMIN`
- variables de bootstrap admin configuradas
- filtros (`fromDate`, `toDate`, `username`, paginacion) no estan demasiado restrictivos

## Como ejecuto IA 100% local open-source?

1. Define `OPEN_SOURCE_IA=true`
2. Define `LLM_PROVIDER=ollama`
3. Descomenta `ollama` y `ollama-init` en `docker-compose.yml`
4. Asegura pull/init del modelo antes de probar extraccion
