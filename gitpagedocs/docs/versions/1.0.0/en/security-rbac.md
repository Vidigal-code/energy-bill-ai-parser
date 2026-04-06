# Security and RBAC Governance

The **Energy Bill AI Parser** is secure by design. It embraces a "Default Deny" ideology paired forcefully with cryptographic JWT abstractions ensuring data remains sealed for unauthorized entities.

## NestJS Guard Defenses
Controllers do not leak. Globally, the root injection provides a raw `JwtAuthGuard`. Only endpoints marked gracefully with the `@Public()` context decorator (ex: Register / Login) bypass standard token inspections.

## Role-Based Access Control (RBAC) Rulesets
Authentication provides identity. Authorization dictates capacity. The server utilizes two primary tiers:
- **`USER` Tier**:
  - Pushes invoice uploads strongly bonded logically to their account (Tenant-Isolation).
  - Only fetches UI dashboard reports mapped to their respective IDs.
- **`ADMIN` Tier**:
  - Holds superuser visibility into global metrics under `/api/admin/users`.
  - Reviews holistic Audit log entries without bias to trace security issues.

### The `Roles` Decorator Lifecycle
Sensitive routes require `@Roles(Role.ADMIN)`. A `RolesGuard` automatically catches matching headers, decodes the JWT signature symmetrically, and asserts if `user.role === 'ADMIN'` seamlessly.

## JWE (JSON Web Encryption) in Transit/Rest
PostgreSQL records nor raw Amazon S3 objects store open payloads. Using the `node-jose` implementation block, invoices URLs and related object-storage keys are heavily RSA encrypted forming a long cryptographic token known as a JWE payload. A malicious S3 Bucket scraping event would not grant them decipherable IDs, only garbage text.
