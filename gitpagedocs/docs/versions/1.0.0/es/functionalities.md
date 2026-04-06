# Funcionalidades

Mapa de funcionalidades de **energy-bill-ai-parser** alineado con el código.

## Autenticación y usuarios

- **Registro / login** con hash de contraseña y emisión de JWT.
- **Refresh token** y **logout**.
- **Perfil** del usuario actual.
- **Roles** `ADMIN` y `USER` aplicados en rutas y handlers.

## Facturas y procesamiento de PDF

- **Subida** de PDFs de facturas (multipart) con validación y metadatos.
- **Pipeline de extracción** que:
  - Selecciona el LLM activo según configuración.
  - Envía el PDF (o representación derivada según el proveedor) al modelo.
  - Mapea la salida al **contrato de extracción** y persiste resultados.
- **Dashboards** y listados filtrados por rol.

## Módulo LLM

- **Multi-proveedor**: Gemini, OpenAI, Claude, Ollama, etc.
- **Selección dinámica** vía entorno / runtime.
- **Ollama**: puede convertir páginas del PDF a imágenes cuando la API no acepta PDF (ver `README` en la raíz para `OPEN_SOURCE_IA` y `LLM_PROVIDER`).

## Almacenamiento y cifrado

- **JWE** para cargas sensibles antes del almacenamiento cuando aplique.
- **S3-compatible**; **LocalStack** en Docker local.

## Administración

- APIs **admin** para usuarios, documentos, facturas y visibilidad de auditoría (según implementación).
- **RBAC** para acciones solo `ADMIN`.

## Auditoría

- Registros de **auditoría** para acciones relevantes (según configuración).

## API y documentación

- **Swagger** (`/api/docs/pt`, `/api/docs/en`).
- **Health** para orquestación y uptime.

## Documentación estática (este sitio)

- Páginas **Markdown**, rutas **HTML** (visor de código) y **vídeo** con la ejecución del proyecto.

> Versión: 1.0.0
