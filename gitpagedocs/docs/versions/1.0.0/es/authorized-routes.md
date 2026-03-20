# Rutas autorizadas

Dos capas: **este sitio de documentación** (Git Page Docs) y la **API** de **energy-bill-ai-parser**.

## API de la aplicación (NestJS)

- La mayoría de rutas requieren **JWT** tras el login.
- **RBAC** restringe endpoints administrativos a roles como `ADMIN`.
- Rutas públicas incluyen **auth** (registro/login) y **health** según configuración.

Consulta Swagger (`/api/docs/en`) para la lista exacta de rutas y guards.

## Git Page Docs (este sitio)

El fichero `gitpagedocs/docs/versions/1.0.0/config.json` puede definir:

- **`auth.accessKeys`** – claves con nombre para desbloquear rutas protegidas de la doc.
- **`authorization`** por ruta – `accessKeyId`, `requiredRoles`, `requireExternalAuth`, `allowedProviders`.

Los proveedores pueden incluir **Auth.js**, **Clerk**, **Firebase**, **JWT** (ver `auth.providers` en el mismo fichero).

### Ejemplo

```json
"authorization": {
  "accessKeyId": "docs-key",
  "requiredRoles": ["maintainer"],
  "requireExternalAuth": true,
  "allowedProviders": ["authjs", "jwt"]
}
```

Úsalo cuando necesites ocultar documentación interna o el **source viewer** tras clave o SSO. Para documentación pública, deja rutas sin `authorization` o distribuye claves de solo lectura.

> Versión: 1.0.0
