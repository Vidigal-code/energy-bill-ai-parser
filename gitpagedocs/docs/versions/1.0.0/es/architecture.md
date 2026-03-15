# Arquitectura

El repositorio sigue un split tipo monorepo con aplicaciones separadas `backend` y `frontend`.

## Mapa del repositorio

- `backend/`: API NestJS con modulos por dominio
- `frontend/`: UI Next.js App Router con estructura inspirada en FSD
- `docker-compose.yml`: orquestacion de aplicacion + infraestructura
- `envexample.txt`: template oficial de variables

## Fronteras de modulo en backend

- `auth`: ciclo de sesion, refresh, perfil, guards
- `invoices`: carga + extraccion + dashboards
- `admin`: gobernanza de usuarios/facturas/documentos/auditoria
- `llm`: abstraccion de providers y parser de salida
- `storage`: cifrado JWE + adapter S3
- `audit`: registro de acciones sensibles
- `health`: endpoint de liveness

Capa compartida (cross-cutting):

- `shared/config`: schema y parse de env
- `shared/http`: contrato de respuesta, interceptors y filtro global
- `shared/prisma`: service/module de Prisma
- `shared/logging`: logger estructurado

## Ciclo de solicitud (API)

1. La solicitud entra por el prefijo global `/api`
2. Guards globales aplican JWT + roles (excepto `@Public`)
3. ValidationPipe valida y sanea payload
4. Service/use-case ejecuta logica de negocio
5. Interceptor de exito estandariza la respuesta
6. Excepciones se normalizan por el filtro global

## Flujo de extraccion de factura

1. Usuario sube PDF en `POST /api/invoices/extract`
2. Se valida tipo/tamano (`PDF_MAX_FILE_SIZE_MB`)
3. Archivo se cifra con JWE
4. Contenido cifrado se guarda en storage S3
5. Provider IA configurado extrae campos
6. Se calculan metricas de negocio
7. Se persiste factura + metricas + metadatos del documento
8. Se guarda auditoria; puede ejecutarse rollback en fallo

## Arquitectura frontend

- Paginas: `login`, `register`, `dashboard`, `invoices`, `profile`, `admin`
- API routes:
  - `api/auth/*` para operaciones de sesion
  - `api/proxy/[...path]` para proxy autenticado
- Estrategia de sesion:
  - cookies HTTP-only para access/refresh tokens
  - refresh transparente en `401`

## Puntos clave del modelo de datos

- `User` con rol y estado activo
- `RefreshToken` para control de rotacion
- `Invoice` con campos extraidos y estado
- `InvoiceMetrics` con KPIs calculados
- `StoredDocument` con object key/checksum
- `AuditLog` con actor, accion, estado y contexto
