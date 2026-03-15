# Energy Bill AI Parser

Plataforma full-stack para procesar facturas de energia en PDF con extraccion por IA, autenticacion segura, RBAC, auditoria y almacenamiento cifrado.

## Que entrega este proyecto

- Carga de PDF y extraccion estructurada de datos de factura
- Soporte para multiples proveedores IA (`gemini`, `openai`, `claude`, `ollama`)
- Calculo de metricas de negocio (energia y financiero)
- Backend seguro con JWT + rotacion de refresh token + RBAC
- Area administrativa para usuarios, facturas, documentos y auditoria
- Frontend Next.js con sesion mediante cookie HTTP-only

## Stack tecnologico

- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: Next.js (App Router), React, Redux Toolkit, React Query
- IA: Gemini, OpenAI, Claude, Ollama
- Storage: API S3 (`aws` o `localstack`) + cifrado JWE
- Orquestacion: Docker Compose

## Modulos del producto

- `backend/src/modules/auth`: registro, login, refresh, logout, perfil
- `backend/src/modules/invoices`: flujo de extraccion, listado, dashboards
- `backend/src/modules/admin`: CRUD privilegiado y gobernanza
- `backend/src/modules/llm`: adapters de provider y parser de respuesta
- `backend/src/modules/storage`: almacenamiento y recuperacion cifrados
- `backend/src/modules/audit`: persistencia de auditoria
- `frontend/src/app`: login, register, dashboard, invoices, profile, admin

## URLs principales en desarrollo local

- Frontend: `http://localhost:3001`
- API: `http://localhost:3000/api`
- Swagger (EN): `http://localhost:3000/api/docs/en`
- Swagger (PT): `http://localhost:3000/api/docs/pt`
- Health: `http://localhost:3000/api/health`

## Navegacion rapida

- Abre **Primeros pasos** para levantar toda la stack desde cero.
- Abre **Configuracion** para variables de entorno y providers.
- Abre **Publicacion** para Docker y despliegue en produccion.
- Abre **Arquitectura** para mapa de modulos y flujo de datos.
- Abre **Integraciones y extensibilidad** para providers, storage y tema UI.
- Abre **FAQ** para troubleshooting.
