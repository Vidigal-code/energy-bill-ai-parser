# State Management

Accepts energy-bill PDFs, extracts structured fields through a multimodal provider, calculates metrics and exposes listings, dashboards, documents and administration. Compare results with the original PDF; schema validation does not prove that values were read correctly.

## UI and state

TypeScript/NestJS 11 with Prisma 6.4/PostgreSQL, Passport/JWT, Argon2, Zod, S3 and JWE; Next.js 16.1.6/React 19.2.3 frontend with Redux Toolkit and TanStack Query. auth, invoices, llm, storage, audit, admin and health separate presentation, application and contracts. The use case depends on ILlmExtractor and DocumentStoragePort. Processing is synchronous within the request; this flow has no extraction queue.

Invoice links uploader, Decimal/JSON extracted fields and metrics; StoredDocument stores bucket/key, checksum, size and optional invoice; AuditLog stores actor/action/status. Queries filter user and role. Protect LLM/encryption keys and back up encryption keys for recovery. S3 encryption at rest does not prevent the original PDF from reaching the selected provider. UI local state is separate from query cache; the backend determines authorization/values.

Login/registration → access and refresh tokens → JwtAuthGuard/RolesGuard. USER queries its uploaderUserId data; ADMIN has administrative queries. RefreshToken stores hash, jti, expiry, revocation and replacement; refresh is not stateless. The controller inventory lists actual routes.

## Verified sources

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

## Related files

- [backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts)
- [backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts)
- [backend/src/modules/llm/llm.module.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/llm/llm.module.ts)
- [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts)
- [backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)
- [docker-compose.yml](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/docker-compose.yml)

## Navigation

- [Project guide](?menu=en&lang=en&id=19)
- [Source reference](?menu=en&lang=en&id=20)
