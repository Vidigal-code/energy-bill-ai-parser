# Visión General del Backend

Recibe facturas eléctricas PDF, extrae campos mediante un proveedor multimodal, calcula indicadores y ofrece listas, dashboards, documentos y administración. Compare resultados con el PDF; validar el esquema no demuestra que los valores se hayan leído correctamente.

## Flujo y casos de fallo

1. Login/registro → tokens de acceso/refresh → JwtAuthGuard/RolesGuard. USER consulta sus datos por uploaderUserId; ADMIN tiene consultas administrativas. RefreshToken guarda hash, jti, caducidad, revocación y sustitución; refresh no es stateless. El inventario de controllers enumera rutas reales.

2. POST /api/invoices/extract recibe multipart file. Archivo ausente: 400; MIME distinto de application/pdf: 415; tamaño superior a PDF_MAX_FILE_SIZE_MB: 413. El archivo se cifra como JWE y sube a S3 antes de extraer. Comprobar MIME no equivale a inspeccionar todo el contenido.

3. OPEN_SOURCE_IA=true selecciona Ollama; en otro caso LLM_PROVIDER elige openai (predeterminado), gemini/google o claude. Usa adaptadores HTTP, no requiere SDK Gemini. Proveedores validan un contrato común; Ollama convierte PDF a imagen. Modelo/endpoint vienen de configuración. ROLLBACK_ON_INVOICE_FAILURE se lee/registra pero no desactiva la limpieza S3 del caso de uso actual.

4. Extracción válida → cálculo → transacción Prisma guarda Invoice SUCCESS, InvoiceMetrics y StoredDocument → AuditLog SUCCESS → respuesta con invoiceId, documentId, extraction y metrics. Consumo suma kWh eléctricos y SCEEE; compensada usa GD I; totalSinGD suma electricidad, SCEEE e iluminación; ahorro usa el valor GD I. No convierte automáticamente el ahorro a valor absoluto.

5. Un fallo dentro de extracción/persistencia intenta eliminar S3, audita error y propaga excepción. Fallo al eliminar registra warning. El upload inicial ocurre antes del bloque; fallo de auditoría después del commit puede dejar registros sin objeto. Existen enums PROCESSING/ERROR, pero no se crea una factura por cada intento fallido.

| Método y ruta | Declaración |
| --- | --- |
| `DELETE /api/admin/documents/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `DELETE /api/admin/invoices/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `DELETE /api/admin/users/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/audit-logs` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/documents/:id/download` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/documents` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/invoices` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/users` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/auth/me` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `GET /api/health` | [backend/src/modules/health/health.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/health/health.controller.ts) |
| `GET /api/invoices/dashboard/consolidated` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices/dashboard/energy` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices/dashboard/financial` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices/my-documents` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `PATCH /api/admin/invoices/:id/reference-month` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `PATCH /api/admin/users/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `PATCH /api/auth/me` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/admin/users` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `POST /api/auth/login` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/auth/logout` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/auth/refresh` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/auth/register` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/invoices/extract` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |

## Ejemplo de petición

```http
POST /api/invoices/extract HTTP/1.1
Authorization: Bearer <access-token>
Content-Type: multipart/form-data; boundary=invoice

--invoice
Content-Disposition: form-data; name="file"; filename="bill.pdf"
Content-Type: application/pdf

<PDF bytes>
--invoice--
```

## Archivos relacionados

- [backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts)
- [backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts)
- [backend/src/modules/llm/llm.module.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/llm/llm.module.ts)
- [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts)
- [backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)
- [docker-compose.yml](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/docker-compose.yml)

## Navegación

- [Project guide](?menu=es&lang=es&id=19)
- [Source reference](?menu=es&lang=es&id=20)
