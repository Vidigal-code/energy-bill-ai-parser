# Configuración Docker y Contenedores

La piedra angular del arranque es el archivo en la base nombrado como `docker-compose.yml`.

## Servicios Ensamblados
Al invocar `docker compose up --build` se genera una red virtual local (bridge) atando todo el bloque:
1. `backend`: Inicia la orquestación pura de NestJS mapeando al `:3000`. Contiene internamente software extra como *ghostscript* para manipular visualmente PDFs.
2. `frontend`: Componentes React/Next anclados al puerto `:3001`.
3. `postgres`: Establece el ecosistema relacional SQL. Engancha su lectura directamente a un Volume permanente (Evitando la pérdida irrecuperable de datos si el contenedor se tumba).
4. `localstack`: Finge localmente ser el núcleo de Amazon AWS S3, expuesto en el canal `:4566`. Inesperadamente poderoso. Crea los buckets automáticos por el script embebido `init-s3.sh`.
5. `ollama` (Opcional): Bloque inerte; si descomentas el bloque yaml localmente, levantará un ecosistema Llama LLM offline sin conectarse nunca a internet.
