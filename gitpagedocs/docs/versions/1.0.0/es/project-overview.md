# Arquitectura del proyecto

Arquitectura actual de `energy-bill-ai-parser` para la version `1.0.0`.

## Estructura del repositorio

- `backend/`: API NestJS
- `frontend/`: UI Next.js App Router
- `docker-compose.yml`: orquestacion de la stack

## Modulos del backend

- `auth`: registro, login, refresh, logout, perfil
- `invoices`: carga, extraccion, listados, dashboards
- `admin`: gobernanza de usuarios, documentos, facturas y auditoria
- `llm`: abstraccion de providers y parse de salida
- `storage`: JWE + adapters S3
- `audit`: trazabilidad de acciones sensibles
- `health`: endpoint de liveness

## Modulos del frontend

- Rutas: `login`, `register`, `dashboard`, `invoices`, `profile`, `admin`
- Sesion: cookies HTTP-only
- API routes: `api/auth/*` y `api/proxy/[...path]`

## Flujo de datos (extraccion)

1. Carga del PDF
2. Validacion (tipo + limite de tamano)
3. Cifrado JWE
4. Almacenamiento S3 compatible
5. Extraccion IA por provider seleccionado
6. Calculo de metricas
7. Persistencia + auditoria

## Modelo de seguridad

- JWT y RBAC (`ADMIN`, `USER`)
- Rotacion de refresh token
- Rate-limit global y headers Helmet
- Contrato estandar de respuesta/error
