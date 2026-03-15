# Publicacion

El despliegue puede hacerse con Docker Compose (recomendado) o con servicios separados.

## Deploy con Docker Compose (ruta de referencia)

En la raiz del repositorio:

1. Asegura que `.env` exista con secretos de produccion
2. Ejecuta `docker compose up --build -d`
3. Valida salud:
   - `GET /api/health`
   - frontend en `/login`

Servicios iniciados:

- `postgres` (base de datos)
- `localstack` (storage compatible S3 para local/dev)
- `backend` (API NestJS)
- `frontend` (app Next.js)

Opcional:

- `backend-tests` con profile `test`
- `ollama` y `ollama-init` (comentados por defecto)

## Comportamiento de arranque del backend

El comando del contenedor backend ejecuta:

- `npx prisma db push`
- `node dist/src/main.js`

Esto sincroniza schema antes de exponer la API.

## Checklist minimo de produccion

- Define valores fuertes para `JWT_*` y `JWE_SECRET`
- Desactiva logs verbosos si hace falta (`LOGS=false`)
- Restringe la politica CORS segun dominio
- Usa PostgreSQL administrado con credenciales seguras
- Usa S3 real (`STORAGE_DRIVER=aws`) en cloud
- Guarda claves de provider de forma segura (`GEMINI_API_KEY`, etc.)

## Flujo recomendado de release

1. Build y tests de backend y frontend
2. Smoke test de extraccion con factura real
3. Deploy de la stack
4. Validaciones post-deploy:
   - flujo auth (`register/login/refresh/logout`)
   - extraccion de factura
   - valores de dashboards
   - endpoints administrativos

## Notas para escala horizontal

- La API es stateless (basada en JWT), apta para multiples instancias
- Dependencias compartidas deben externalizarse:
  - PostgreSQL
  - storage compatible S3
- Parametros de rate-limit deben ajustarse al trafico real
