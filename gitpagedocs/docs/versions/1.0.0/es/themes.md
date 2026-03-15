# Integraciones y extensibilidad

Esta seccion reemplaza la guia generica de "temas" por puntos reales de extension del proyecto.

## Providers de IA

Adapters disponibles:

- `gemini` (default por soporte PDF multimodal nativo)
- `openai`
- `claude`
- `ollama` (camino local open-source)

Referencias de codigo:

- `backend/src/modules/llm/infrastructure/providers/*`
- `backend/src/modules/llm/application/extraction-response.parser.ts`

## Estrategia de providers

- Seleccion en runtime con `LLM_PROVIDER`
- Prompt/referencia/contexto inyectables por env
- Salida normalizada al contrato de factura

Con Ollama:

- la app puede convertir la primera pagina del PDF a imagen
- esto habilita flujo local open-source cuando no hay carga PDF nativa

## Adapters de almacenamiento

Abstraccion principal de storage:

- Puerto: `backend/src/modules/storage/domain/document-storage.port.ts`
- Adapter actual: implementacion S3 compatible

Drivers soportados:

- `localstack` para local/desarrollo
- `aws` para cloud

## Puntos de extension de seguridad

- Integrar secretos con Vault/KMS
- Aplicar allowlist CORS estricta
- Enriquecer metadata de auditoria para compliance

## Tema visual del frontend

El frontend actual usa Tailwind + convencion dark/light.

Para evolucionar tema visual:

- centralizar design tokens en `frontend/src/shared`
- exponer estado de tema en store global
- mantener contraste consistente en dashboards y tablas
