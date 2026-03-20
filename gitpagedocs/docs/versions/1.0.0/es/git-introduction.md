# Arquitectura e infraestructura

Profundización en la estructura de **energy-bill-ai-parser** y la interacción entre servicios.

## Monorepo

- **Backend** (`backend/`): aplicación NestJS con límites modulares.
- **Frontend** (`frontend/`): Next.js App Router, estructura feature-sliced.
- **Infra** (`docker-compose.yml`): Postgres, LocalStack opcional, contenedores de la app.

## Capas backend

- **Presentación**: controladores, DTOs, guards, pipes.
- **Dominio / aplicación**: casos de uso, contrato de extracción, errores de dominio.
- **Infraestructura**: Prisma, cliente S3, adaptadores LLM, integraciones externas.

Aspectos transversales en `backend/src/shared` (config, logging, filtros).

## Capas frontend

- **`app/`**: rutas, layouts, límites servidor/cliente.
- **`entities/`**, **`features/`**, **`widgets/`**: composición UI y estado (Redux Toolkit + React Query).

La sesión usa rutas **Next.js** y cookies **HTTP-only** hacia la API.

## Servicios Docker Compose

Servicios típicos:

- **postgres** – base de datos principal.
- **backend** – API NestJS.
- **frontend** – Next.js.
- **localstack** (si está activo) – API compatible con S3.

Puertos y variables en `docker-compose.yml` y `envexample.txt`.

## Ejecución LLM

- **Gemini** (a menudo predeterminado) acepta **PDF directamente** en la API multimodal, alineado con el requisito de no extraer texto antes del modelo.
- **Ollama** puede requerir **conversión de páginas PDF a imagen** cuando el modelo no acepta `application/pdf`.

## Observabilidad

- Logging estructurado (sin `console` en rutas de producción).
- Mensajes centralizados para errores al usuario (`backend/src/shared/messages/pt-br.messages.ts`).

## Seguridad y red

- **Helmet** para cabeceras HTTP.
- **Throttler** para rate limiting global.
- **CORS** y cookies alineados con el origen del frontend.

> Versión: 1.0.0
