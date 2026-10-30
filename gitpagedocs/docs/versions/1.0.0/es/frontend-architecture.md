# Arquitectura del Frontend

Recibe facturas eléctricas PDF, extrae campos mediante un proveedor multimodal, calcula indicadores y ofrece listas, dashboards, documentos y administración. Compare resultados con el PDF; validar el esquema no demuestra que los valores se hayan leído correctamente.

## Interfaz y estado

TypeScript/NestJS 11 con Prisma 6.4/PostgreSQL, Passport/JWT, Argon2, Zod, S3 y JWE; frontend Next.js 16.1.6/React 19.2.3 con Redux Toolkit y TanStack Query. Módulos auth, invoices, llm, storage, audit, admin y health separan presentación, aplicación y contratos. El caso de uso depende de ILlmExtractor y DocumentStoragePort. El procesamiento es síncrono, sin cola de extracción.

Invoice vincula uploader, campos Decimal/JSON y métricas; StoredDocument guarda bucket/clave, checksum, tamaño y factura opcional; AuditLog guarda actor/acción/estado. Consultas filtran usuario/rol. Proteja claves LLM/cifrado y respalde las de cifrado. Cifrar S3 no impide enviar el PDF original al proveedor seleccionado. Backend determina autorización/valores.

Login/registro → tokens de acceso/refresh → JwtAuthGuard/RolesGuard. USER consulta sus datos por uploaderUserId; ADMIN tiene consultas administrativas. RefreshToken guarda hash, jti, caducidad, revocación y sustitución; refresh no es stateless. El inventario de controllers enumera rutas reales.

## Fuentes verificadas

- [frontend/src/app/admin/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/admin/page.tsx)
- [frontend/src/app/api/auth/login/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/login/route.ts)
- [frontend/src/app/api/auth/logout/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/logout/route.ts)
- [frontend/src/app/api/auth/me/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/me/route.ts)
- [frontend/src/app/api/auth/refresh/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/refresh/route.ts)
- [frontend/src/app/api/auth/register/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/auth/register/route.ts)
- [frontend/src/app/api/proxy/[...path]/route.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/api/proxy/[...path]/route.ts)
- [frontend/src/app/dashboard/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/dashboard/page.tsx)
- [frontend/src/app/invoices/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/invoices/page.tsx)
- [frontend/src/app/login/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/login/page.tsx)
- [frontend/src/app/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/page.tsx)
- [frontend/src/app/profile/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/profile/page.tsx)
- [frontend/src/app/register/page.tsx](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/app/register/page.tsx)
- [frontend/src/entities/admin/api/admin.client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/admin/api/admin.client.ts)
- [frontend/src/entities/auth/api/auth.client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/auth/api/auth.client.ts)
- [frontend/src/entities/auth/model/auth.slice.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/auth/model/auth.slice.ts)
- [frontend/src/entities/invoice/api/invoice.client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/entities/invoice/api/invoice.client.ts)
- [frontend/src/shared/api/client.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/api/client.ts)
- [frontend/src/shared/api/server-auth.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/api/server-auth.ts)
- [frontend/src/shared/api/types.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/api/types.ts)
- [frontend/src/shared/store/hooks.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/store/hooks.ts)
- [frontend/src/shared/store/store.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/frontend/src/shared/store/store.ts)

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
