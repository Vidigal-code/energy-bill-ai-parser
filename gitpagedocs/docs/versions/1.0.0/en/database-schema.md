# Relational Database Schema (Prisma)

Structural integrity of financial and operational persistence is guaranteed via a PostgreSQL relational database, cleanly orchestrated by the Prisma ORM tool.

## Key Prisma Entities

### `User`
Maintains safe-hashed auth records alongside authorization levels.
- **Relationships:** `1-N` towards Invoices (One user issues many invoices). `1-N` relative to Auditlogs.
- **Notable Fields:** `passwordHash`, `role` (`ADMIN` or `USER`), `refreshToken`.

### Billing Core Models
These schemas save invoice tracking links mapping directly to S3 Buckets, alongside AI Extracted payloads.

- **`Invoice`**: Validates the physical existence of a file uploaded online, recording the UUID keys needed to securely decrypt/fetch the payload from Cloud Object Storage architectures.
- **`InvoiceExtractedData`**: A strict `1-1` relational table attached to `Invoice` saving the raw deterministic metrics from LLM responses: `numeroCliente`, `consumoEnergiaEletricaKwh`, and values. Emitting this into a flat-table matrix empowers incredibly fast frontend analytical dashboards and sorting paradigms.

### `AuditLog`
The security non-repudiation ledger mechanism. Any write action of significant impact logs a snapshot within this table.
- **Notable Fields:** `action`, `resource`, `ipAddress`, `operatorId`.
