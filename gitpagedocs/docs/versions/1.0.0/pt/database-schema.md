# Esquema de Banco de Dados

Recebe faturas de energia em PDF, extrai campos estruturados por um provedor multimodal, calcula indicadores e oferece listagem, dashboards, documentos e administração. O resultado deve ser conferido contra o PDF original; validação de esquema não garante que os números foram lidos corretamente.

## Contratos de dados

Invoice vincula uploader, campos extraídos em Decimal/JSON e métricas; StoredDocument guarda bucket/chave, checksum, tamanho e vínculo opcional; AuditLog guarda ator/ação/status. Consultas filtram usuário e papel. Proteja chaves de LLM e de criptografia e mantenha backup dessas chaves para recuperar arquivos. Criptografia em repouso no S3 não impede que o PDF original seja enviado ao provedor escolhido. A UI separa estado local do cache de requisições; o backend determina autorização e valores.

### Role

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `ADMIN` | `` |
| `USER` | `` |

### InvoiceStatus

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `PROCESSING` | `` |
| `SUCCESS` | `` |
| `ERROR` | `` |

### AuditStatus

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `SUCCESS` | `` |
| `ERROR` | `` |

### User

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `id` | `String          @id @default(cuid())` |
| `email` | `String          @unique` |
| `username` | `String          @unique` |
| `passwordHash` | `String` |
| `role` | `Role            @default(USER)` |
| `isActive` | `Boolean         @default(true)` |
| `createdAt` | `DateTime        @default(now())` |
| `updatedAt` | `DateTime        @updatedAt` |
| `refreshTokens` | `RefreshToken[]` |
| `invoices` | `Invoice[]` |
| `auditLogs` | `AuditLog[]` |
| `storedDocuments` | `StoredDocument[] @relation("UploaderDocuments")` |

### RefreshToken

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `id` | `String   @id @default(cuid())` |
| `userId` | `String` |
| `tokenHash` | `String` |
| `jti` | `String   @unique` |
| `expiresAt` | `DateTime` |
| `revokedAt` | `DateTime?` |
| `replacedByTokenId` | `String?` |
| `userAgent` | `String?` |
| `ip` | `String?` |
| `createdAt` | `DateTime @default(now())` |
| `user` | `User     @relation(fields: [userId], references: [id], onDelete: Cascade)` |
| `@@index([userId])` | `` |

### Invoice

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `id` | `String         @id @default(cuid())` |
| `uploaderUserId` | `String` |
| `fileName` | `String` |
| `status` | `InvoiceStatus  @default(PROCESSING)` |
| `errorMessage` | `String?` |
| `numeroCliente` | `String` |
| `mesReferencia` | `String` |
| `energiaEletricaQuantidadeKwh` | `Decimal        @db.Decimal(14, 3)` |
| `energiaEletricaValorRs` | `Decimal        @db.Decimal(14, 2)` |
| `energiaSceeSemIcmsQuantidadeKwh` | `Decimal        @db.Decimal(14, 3)` |
| `energiaSceeSemIcmsValorRs` | `Decimal        @db.Decimal(14, 2)` |
| `energiaCompensadaGdiQuantidadeKwh` | `Decimal        @db.Decimal(14, 3)` |
| `energiaCompensadaGdiValorRs` | `Decimal        @db.Decimal(14, 2)` |
| `contribIlumPublicaMunicipalValorRs` | `Decimal        @db.Decimal(14, 2)` |
| `extractionProvider` | `String` |
| `rawExtractionJson` | `Json` |
| `createdAt` | `DateTime       @default(now())` |
| `updatedAt` | `DateTime       @updatedAt` |
| `metrics` | `InvoiceMetrics?` |
| `uploader` | `User           @relation(fields: [uploaderUserId], references: [id], onDelete: Restrict)` |
| `documents` | `StoredDocument[]` |
| `@@index([uploaderUserId])` | `` |
| `@@index([numeroCliente])` | `` |
| `@@index([mesReferencia])` | `` |
| `@@index([status])` | `` |

### InvoiceMetrics

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `id` | `String   @id @default(cuid())` |
| `invoiceId` | `String   @unique` |
| `consumoEnergiaEletricaKwh` | `Decimal  @db.Decimal(14, 3)` |
| `energiaCompensadaKwh` | `Decimal  @db.Decimal(14, 3)` |
| `valorTotalSemGdRs` | `Decimal  @db.Decimal(14, 2)` |
| `economiaGdRs` | `Decimal  @db.Decimal(14, 2)` |
| `createdAt` | `DateTime @default(now())` |
| `updatedAt` | `DateTime @updatedAt` |
| `invoice` | `Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)` |

### StoredDocument

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `id` | `String   @id @default(cuid())` |
| `invoiceId` | `String?` |
| `uploaderUserId` | `String` |
| `bucket` | `String` |
| `objectKey` | `String   @unique` |
| `fileName` | `String` |
| `mimeType` | `String` |
| `sizeBytes` | `Int` |
| `checksum` | `String` |
| `createdAt` | `DateTime @default(now())` |
| `updatedAt` | `DateTime @updatedAt` |
| `invoice` | `Invoice? @relation(fields: [invoiceId], references: [id], onDelete: SetNull)` |
| `uploader` | `User     @relation("UploaderDocuments", fields: [uploaderUserId], references: [id], onDelete: Restrict)` |
| `@@index([uploaderUserId])` | `` |
| `@@index([invoiceId])` | `` |
| `@@index([createdAt])` | `` |

### AuditLog

[backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)

| Field | Type / constraint |
| --- | --- |
| `id` | `String      @id @default(cuid())` |
| `actorUserId` | `String?` |
| `action` | `String` |
| `resourceType` | `String` |
| `resourceId` | `String?` |
| `status` | `AuditStatus @default(SUCCESS)` |
| `message` | `String` |
| `meta` | `Json?` |
| `ip` | `String?` |
| `userAgent` | `String?` |
| `createdAt` | `DateTime    @default(now())` |
| `actor` | `User?       @relation(fields: [actorUserId], references: [id], onDelete: SetNull)` |
| `@@index([actorUserId])` | `` |
| `@@index([action])` | `` |
| `@@index([resourceType])` | `` |
| `@@index([createdAt])` | `` |

## Arquivos relacionados

- [backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts)
- [backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts)
- [backend/src/modules/llm/llm.module.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/llm/llm.module.ts)
- [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts)
- [backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)
- [docker-compose.yml](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/docker-compose.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=19)
- [Source reference](?menu=pt&lang=pt&id=20)
