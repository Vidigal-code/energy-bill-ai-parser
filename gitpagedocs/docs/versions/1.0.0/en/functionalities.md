# Functionalities

Feature map of **energy-bill-ai-parser** aligned with the codebase.

## Authentication and users

- **Register / login** with password hashing and JWT issuance.
- **Refresh token** rotation and **logout**.
- **Profile** endpoint for the current user.
- **Roles**: `ADMIN` and `USER` enforced at route/handler level.

## Invoices and PDF processing

- **Upload** energy bill PDFs (multipart) with validation and persistence metadata.
- **Extraction pipeline** that:
  - Selects the active LLM provider from configuration.
  - Sends the PDF (or derived representation per provider rules) to the model.
  - Maps model output to the **invoice extraction contract** and persists results.
- **Dashboards** and listings filtered by role (user vs admin views).

## LLM module

- **Multi-provider** support: Gemini, OpenAI, Anthropic (Claude), Ollama, etc.
- **Dynamic provider** selection via environment / runtime config.
- **Ollama** path may convert PDF pages to images when the API does not accept PDF bytes directly (see root README for `OPEN_SOURCE_IA` and `LLM_PROVIDER`).

## Storage and encryption

- **JWE** encryption for sensitive payloads before storage where applicable.
- **S3-compatible** API; **LocalStack** in local Docker for bucket operations.

## Administration

- **Admin** APIs for users, documents, invoices, and audit visibility (depending on module implementation).
- Operational consistency with **RBAC** (`ADMIN` only for destructive or global actions).

## Audit

- **Audit** records for security-relevant actions (configuration-dependent).

## API and docs

- **Swagger** (`/api/docs/pt`, `/api/docs/en`) for interactive API exploration.
- **Health** endpoint for orchestration and uptime checks.

## Static documentation (this site)

- **Markdown** pages for guides, **HTML** routes for the embedded **source viewer**, and **video** routes for the project walkthrough.

> Version: 1.0.0
