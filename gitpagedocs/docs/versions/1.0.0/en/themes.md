# Integrations and Extensibility

This section replaces generic "themes" guidance with practical extension points of this project.

## AI providers

Available provider adapters:

- `gemini` (default for native PDF multimodal support)
- `openai`
- `claude`
- `ollama` (open-source local model path)

Code references:

- `backend/src/modules/llm/infrastructure/providers/*`
- `backend/src/modules/llm/application/extraction-response.parser.ts`

## Provider strategy

- Selection is runtime-based through `LLM_PROVIDER`
- Prompt/reference/context can be injected by env
- Output is normalized to invoice contract fields

When using Ollama:

- the app can convert first PDF page to image for vision-compatible calls
- this helps local open-source workflows where direct PDF upload is unavailable

## Storage adapters

Primary document storage abstraction:

- Port: `backend/src/modules/storage/domain/document-storage.port.ts`
- Default adapter: S3-compatible implementation

Current drivers:

- `localstack` for local/development
- `aws` for cloud deployments

## Security extension points

- Replace secrets management with Vault/KMS integrations
- Add stronger CORS origin allowlist policy
- Extend audit metadata for compliance rules

## Frontend UI theming

Current frontend uses Tailwind + dark/light mode conventions.

To evolve visual themes:

- centralize design tokens in `frontend/src/shared`
- expose theme switcher state in global store
- keep contrast parity for dashboard and table components
