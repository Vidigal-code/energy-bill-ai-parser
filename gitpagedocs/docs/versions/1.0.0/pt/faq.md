# FAQ

## Por que login funciona, mas endpoints protegidos retornam 401?

Verifique:

- chamadas do frontend passando por `api/proxy/[...path]`
- cookies de auth presentes e nao bloqueados pelo navegador
- refresh token valido e nao revogado
- backend e frontend com URLs base compativeis

## Por que a extracao de fatura falha?

Verifique:

- valor de `LLM_PROVIDER` e chave da API correspondente
- arquivo enviado e PDF valido e abaixo de `PDF_MAX_FILE_SIZE_MB`
- modelo configurado existe (`GEMINI_MODEL`, `OPENAI_MODEL`, etc.)
- logs do backend para erro de parse do provider

## Por que documentos salvam, mas nao fazem download?

Verifique:

- `STORAGE_DRIVER` e configuracao `S3_*`
- bucket existente (`S3_BUCKET`)
- `JWE_SECRET` estavel entre reinicios
- objeto nao foi removido por rotina de rollback

## Por que a aplicacao sobe, mas operacoes no banco falham?

Verifique:

- conectividade de `DATABASE_URL` a partir do backend
- execucao correta de `npx prisma db push`
- healthcheck do postgres aprovado
- schema e credenciais alinhados ao ambiente

## Por que dados admin aparecem vazios?

Verifique:

- conta autenticada com role `ADMIN`
- variaveis de bootstrap do admin padrao configuradas
- filtros (`fromDate`, `toDate`, `username`, paginacao) nao estao restritivos

## Como rodar IA 100% local open-source?

1. Defina `OPEN_SOURCE_IA=true`
2. Defina `LLM_PROVIDER=ollama`
3. Descomente `ollama` e `ollama-init` no `docker-compose.yml`
4. Garanta pull/init do modelo antes de testar extracao
