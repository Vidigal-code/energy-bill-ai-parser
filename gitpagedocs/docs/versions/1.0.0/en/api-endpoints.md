# API Endpoints (Swagger)

The application exposes its REST interfaces via strictly typed endpoints completely documented inside an OpenAPI (Swagger) interface.

## Interactive Swagger

The NestJS backend dynamically bootstraps Swagger servers for integration tests.
- **Swagger PT-BR:** `http://localhost:3000/api/docs/pt`
- **Swagger EN:** `http://localhost:3000/api/docs/en`

All testing functionality and DTO reading can be done actively through the Swagger UI during development.

## Main Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register`: Mints a new internal user identity.
- `POST /api/auth/login`: Returns Access and Refresh JWT Tokens based on Passport validations.
- `POST /api/auth/refresh`: Swaps an expiring token for a fresh one.
- `GET /api/auth/profile`: Fetches the current logged in user (Protected route).

### Invoices (`/api/invoices`)
- `POST /api/invoices/upload`: Bound to Multipart/Form Data (`file`). Extremely strict. Validates the PDF, pushes it to LocalStack/S3, and kicks off AI Vision Extraction concurrently.
- `GET /api/invoices`: Paginated invoice listings. Uses strict RBAC so users only fetch their own files, while `ADMIN` users see all records.
- `GET /api/invoices/:id`: Loads deep details on a specific ID.
- `GET /api/invoices/dashboard/metrics`: Generates high speed accounting aggregations based on AI pre-computed flat fields.

### Admin (`/api/admin`)
- `GET /api/admin/users`: Manages global identities (Strictly requires `ADMIN` role).
- `GET /api/admin/audit-logs`: Monitors immutable tables representing all global network traffic actions.
