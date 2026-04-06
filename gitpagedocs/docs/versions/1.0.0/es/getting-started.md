# Primeros pasos

Esta guía lleva desde un clon limpio hasta un stack **energy-bill-ai-parser** en ejecución (API + web + PostgreSQL + LocalStack S3 opcional).

## Requisitos

- **Node.js** 20+
- **npm** 10+ (u otro gestor compatible)
- **Docker** y Docker Compose (recomendado para el stack completo)
- Clave **Gemini** (u otro LLM configurado) para extracción con visión PDF en modo similar a producción

## 1. Clonar y entorno

1. Clona el repositorio.
2. Copia el fichero de ejemplo:

   ```bash
   cp envexample.txt .env
   ```

3. Edita `.env` y define al menos:

   - **Base de datos**: `DATABASE_URL` (PostgreSQL; Compose aporta valores por defecto)
   - **JWT**: `JWT_SECRET` y refresh según el proyecto
   - **LLM**: p. ej. `GEMINI_API_KEY` (Gemini suele ser el predeterminado para PDF nativo)
   - **Almacenamiento**: S3; **LocalStack** en Docker local

Consulta `envexample.txt` y `backend/src/shared/config/env.schema.ts` para la lista completa.

## 2. Docker Compose (recomendado)

En la raíz del repositorio (con `.env`):

```bash
docker compose up --build
```

Servicios típicos:

| Servicio | URL / puerto |
|----------|----------------|
| Frontend (Next.js) | `http://localhost:3001` |
| API (NestJS) | `http://localhost:3000` |
| Swagger (PT) | `http://localhost:3000/api/docs/pt` |
| Swagger (EN) | `http://localhost:3000/api/docs/en` |
| Health | `http://localhost:3000/api/health` |
| PostgreSQL | `localhost:5432` (según Compose) |
| LocalStack (S3) | `http://localhost:4566` |

## 3. Sin Docker (desarrollo)

- **Backend**: dependencias en `backend/`, migraciones Prisma, Nest en modo dev.
- **Frontend**: dependencias en `frontend/`, servidor Next (típicamente puerto `3001`).

Asegura PostgreSQL (y S3 opcional) acordes con `.env`.

## 4. Pruebas

Tests del backend con perfil Docker (ver `README.md` en la raíz):

```bash
docker compose --profile test up backend-tests --build
```

## 5. Sitio de documentación (esta carpeta)

Los artefactos Git Page Docs están en `gitpagedocs/`. Para ejecutar la documentación en local, usa los scripts del `package.json` en la raíz (p. ej. `npm run dev` si está configurado).

> Versión: 1.0.0
