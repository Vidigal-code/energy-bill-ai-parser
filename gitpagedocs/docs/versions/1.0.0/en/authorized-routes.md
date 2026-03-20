# Authorized routes

Two layers: **this documentation site** (Git Page Docs) and the **energy-bill-ai-parser** API.

## Application API (NestJS)

- Most routes require a **JWT** after login.
- **RBAC** restricts admin-only endpoints to roles such as `ADMIN`.
- Public routes include **auth** (register/login) and **health** as configured in the app.

Refer to Swagger (`/api/docs/en`) for the exact route list and guards.

## Git Page Docs (this site)

The version config `gitpagedocs/docs/versions/1.0.0/config.json` may define:

- **`auth.accessKeys`** – named keys for unlocking protected doc routes.
- **`authorization`** on a route – `accessKeyId`, `requiredRoles`, `requireExternalAuth`, `allowedProviders`.

Providers can include **Auth.js**, **Clerk**, **Firebase**, **JWT** (see `auth.providers` in the same file).

### Example pattern

```json
"authorization": {
  "accessKeyId": "docs-key",
  "requiredRoles": ["maintainer"],
  "requireExternalAuth": true,
  "allowedProviders": ["authjs", "jwt"]
}
```

Use this when you need to hide internal docs or the **source viewer** behind a key or SSO. For public project documentation, keep routes without `authorization` or distribute read-only keys.

> Version: 1.0.0
