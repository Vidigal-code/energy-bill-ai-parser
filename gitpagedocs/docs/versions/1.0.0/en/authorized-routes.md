# Authorized routes

Accepts energy-bill PDFs, extracts structured fields through a multimodal provider, calculates metrics and exposes listings, dashboards, documents and administration. Compare results with the original PDF; schema validation does not prove that values were read correctly.

## Data contracts

Invoice links uploader, Decimal/JSON extracted fields and metrics; StoredDocument stores bucket/key, checksum, size and optional invoice; AuditLog stores actor/action/status. Queries filter user and role. Protect LLM/encryption keys and back up encryption keys for recovery. S3 encryption at rest does not prevent the original PDF from reaching the selected provider. UI local state is separate from query cache; the backend determines authorization/values.

## Workflow and failure cases

Login/registration → access and refresh tokens → JwtAuthGuard/RolesGuard. USER queries its uploaderUserId data; ADMIN has administrative queries. RefreshToken stores hash, jti, expiry, revocation and replacement; refresh is not stateless. The controller inventory lists actual routes.

Copy envexample.txt to .env; configure DATABASE_URL, provider/model, its key, S3 and encryption. Compose starts PostgreSQL, LocalStack, backend/frontend; optional Ollama configuration is commented out, so do not assume it starts. Ollama needs Dockerfile rasterization dependencies and a vision model. Backend has test:unit/test:integration, lint/build; frontend has lint/build. For 503 check provider/key; for rejected PDFs check format/size; for empty dashboards check user/filters/persistence. Actual endpoints include dashboard/consolidated, energy, financial and my-documents.

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
