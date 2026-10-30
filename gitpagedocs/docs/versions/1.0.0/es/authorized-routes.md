# Rutas autorizadas

Recibe facturas eléctricas PDF, extrae campos mediante un proveedor multimodal, calcula indicadores y ofrece listas, dashboards, documentos y administración. Compare resultados con el PDF; validar el esquema no demuestra que los valores se hayan leído correctamente.

## Contratos de datos

Invoice vincula uploader, campos Decimal/JSON y métricas; StoredDocument guarda bucket/clave, checksum, tamaño y factura opcional; AuditLog guarda actor/acción/estado. Consultas filtran usuario/rol. Proteja claves LLM/cifrado y respalde las de cifrado. Cifrar S3 no impide enviar el PDF original al proveedor seleccionado. Backend determina autorización/valores.

## Flujo y casos de fallo

Login/registro → tokens de acceso/refresh → JwtAuthGuard/RolesGuard. USER consulta sus datos por uploaderUserId; ADMIN tiene consultas administrativas. RefreshToken guarda hash, jti, caducidad, revocación y sustitución; refresh no es stateless. El inventario de controllers enumera rutas reales.

Copie envexample.txt a .env; configure DATABASE_URL, proveedor/modelo/clave, S3 y cifrado. Compose inicia PostgreSQL, LocalStack y aplicaciones; Ollama opcional está comentado y no inicia automáticamente. Requiere dependencias de rasterización del Dockerfile y modelo de visión. Backend tiene test:unit/test:integration, lint/build; frontend lint/build. Ante 503 revise proveedor/clave; PDF rechazado formato/tamaño; dashboard vacío usuario/filtros/persistencia. Rutas reales incluyen dashboard/consolidated, energy, financial y my-documents.

## Archivos relacionados

- [backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts)
- [backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts)
- [backend/src/modules/llm/llm.module.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/llm/llm.module.ts)
- [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts)
- [backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)
- [docker-compose.yml](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/docker-compose.yml)

## Navegación

- [Project guide](?menu=es&lang=es&id=19)
- [Source reference](?menu=es&lang=es&id=20)
