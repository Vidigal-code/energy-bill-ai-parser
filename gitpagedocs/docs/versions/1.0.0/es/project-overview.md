# Visión general del proyecto

**energy-bill-ai-parser** es una plataforma full-stack para subir PDFs de facturas de energía, extraer datos estructurados con **varios proveedores LLM** y ofrecer paneles y administración con **JWT**, **RBAC** (`ADMIN` / `USER`), **auditoría** y **almacenamiento cifrado** (JWE + backend compatible con S3).

## Objetivos

- Aceptar PDF y enviarlos al pipeline LLM (visión/documento) según el contrato de extracción.
- Persistir resultados y métricas en **PostgreSQL** con **Prisma**.
- Ofrecer UI **Next.js** alineada con roles y APIs.
- Mantener seguridad y observabilidad (Helmet, throttling, logs estructurados).

## Stack

| Capa | Tecnología |
|------|------------|
| API | NestJS, TypeScript |
| Web | Next.js (App Router), React, Redux Toolkit, React Query, Tailwind |
| Datos | PostgreSQL, Prisma ORM |
| IA | Gemini, OpenAI, Claude, Ollama (selección dinámica) |
| Almacenamiento | API compatible con S3; **LocalStack** en local |
| Criptografía | JWE para datos sensibles en reposo |

## Estructura del repositorio (resumen)

- `backend/` – Módulos NestJS, esquema Prisma, contratos de extracción.
- `frontend/` – App Next.js (estilo FSD: `app`, `shared`, `entities`, `features`, `widgets`).
- `docker-compose.yml` – Postgres, servicios de la app, LocalStack opcional.
- `gitpagedocs/` – Este sitio de documentación (Git Page Docs).

## Módulos backend (concepto)

| Módulo | Responsabilidad |
|--------|-----------------|
| `auth` | Registro, login, refresh, logout, perfil, guards |
| `invoices` | Subida, orquestación de extracción, dashboards, listados por rol |
| `llm` | Selección de proveedor y adaptadores |
| `storage` | Cifrado JWE y operaciones S3 |
| `admin` | CRUD administrativo y vistas operativas |
| `audit` | Pista de auditoría |
| `shared` | Config, logging, filtros, respuestas HTTP, mensajes |

## Contrato de extracción

Reglas y campos esperados centralizados en:

- `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`

Prompts y material de referencia mediante variables de entorno, por ejemplo:

- `INVOICE_EXTRACTION_REFERENCE`
- `INVOICE_EXTRACTION_PROMPT`
- `INVOICE_EXTRACTION_CONTEXT`

## Modelo de seguridad

- JWT en rutas protegidas (salvo auth/health públicas).
- **RBAC**: `ADMIN` frente a `USER`.
- **Helmet** y **rate limiting** (Throttler) globales.

## Sesión en el frontend

El navegador usa rutas Next.js que hacen de proxy de cookies / sesión hacia la API (cookies HTTP-only).

> Versión: 1.0.0
