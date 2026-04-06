# API Endpoints (Swagger)

La aplicación publica todas sus rutas REST a través de esquemas rígidos auto-documentados utilizando OpenAPI (Swagger).

## Swagger Interactivo

El backend levantado con NestJS enruta automáticamente los paneles de interfaz Swagger para testeo.
- **Swagger PT-BR:** `http://localhost:3000/api/docs/pt`
- **Swagger EN:** `http://localhost:3000/api/docs/en`

Conéctese a esas rutas localmente para verificar cualquier esquema DTO o probar disparos manuales.

## Endpoints Primarios

### Auth (`/api/auth`)
- `POST /api/auth/register`: Crea la plantilla inicial de un usuario.
- `POST /api/auth/login`: Verifica la contraseña y arroja las llaves JWT (Access & Refresh) maestras de la sesión.
- `POST /api/auth/refresh`: Refresca la validez del Access Token.
- `GET /api/auth/profile`: Recuperar datos del portador JWT actual (Protegido).

### Invoices (`/api/invoices`)
- `POST /api/invoices/upload`: Acepta Multipart Form Data. Empuja el billete PDF al S3 y extrae sus campos internos al usar LLMs visuales.
- `GET /api/invoices`: Colección y grilla paginada. Está fuertemente ligada al RBAC; cada uno mira sólo sus facturas, excepto los administradores que miran la foto completa.
- `GET /api/invoices/:id`: Detalle extenso de la fila transaccional generada.
- `GET /api/invoices/dashboard/metrics`: Entrega los KPIs agrupados para poblar la vista Frontend.

### Admin (`/api/admin`)
- `GET /api/admin/users`: Manejo y purga de usuarios en base de datos (Requiere RBAC `ADMIN`).
- `GET /api/admin/audit-logs`: Extrae evidencia de rastreo inmutable de lo hecho por cada cuenta en qué tiempo.
