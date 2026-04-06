# Backend Overview (NestJS)

The backend of the **Energy Bill AI Parser** is built on top of **NestJS**, following strict patterns of Dependency Injection, Modularity, and Abstraction. The entire service runs strictly on TypeScript, verifying HTTP integrity via rigorous DTOs (Data Transfer Objects).

## Modular Structure

The application architecture is fragmented into domain-driven modules:

- **`AuthModule`**: Manages Login, Registration, Refresh Tokens, and Logout routines using `JwtStrategy` and `LocalStrategy`.
- **`AdminModule`**: Protected by RBAC Guards enforcing the `ADMIN` role. Offers superuser capabilities over logs, users, and overall invoice overriding.
- **`InvoicesModule`**: The billing core. Drives file uploads, interfaces with the `StorageModule` to persist files, and triggers parsing orchestrations using `LLMModule`.
- **`LLMModule`**: Leverages the Factory Pattern resolving internally whether to dispatch the PDF reading toward **Google Gemini**, **Ollama**, or alternative drivers.
- **`StorageModule`**: Safely transfers payloads across the wire directly into S3 compatible APIs while embedding encryption layers on top.
- **`AuditModule`**: A silent compliance tracking service that ensures user events are monitored and written permanently.

## Global App Mechanisms

- **Guards and Interceptors**: Built-in centralized RBAC. If it lacks an `@Public()` decorator, the endpoint will firmly deny an unauthenticated request. The generic `ResponseInterceptor` formats standard success schemas: `{ success: true, data: ... }`.
- **Exception Filter**: Halts application crash cycles by digesting core exception traces into HTTP-friendly json payloads, simplifying debugging within the Frontend.
