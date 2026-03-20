# Functionalities

Feature map of `energy-bill-ai-parser`.

## Authentication

- User registration and login
- Refresh token flow and secure logout
- Profile read/update endpoints
- Role-based access (`ADMIN`, `USER`)

## Invoice processing

- PDF upload endpoint
- AI extraction with provider abstraction:
  - `gemini`
  - `openai`
  - `claude`
  - `ollama`
- Structured response normalization
- Persisted invoice history with filtering

## Dashboards

- Energy dashboard (`kWh`)
- Financial dashboard (`BRL`)
- Consolidated dashboard for overall metrics

## Administration

- User lifecycle management
- Invoice and document governance
- Audit log query endpoints
- Secure document download and deletion

## Storage and audit

- Encrypted document payloads (JWE)
- S3-compatible object storage
- Action traceability for sensitive operations

## API + Docs + Source visibility

- Swagger docs in EN/PT
- Health endpoint for observability
- Source viewer route in this docs version
