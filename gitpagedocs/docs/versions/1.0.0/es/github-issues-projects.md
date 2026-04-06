# Entrega y evidencias

Usa **Issues** y **Projects** en GitHub para el trabajo en **energy-bill-ai-parser** y adjunta evidencias para revisores.

## Issues sugeridas

- **Bug**: discrepancia de extracción con un PDF; adjunta PDF (si se permite) y logs redactados.
- **Feature**: nuevo proveedor o campo en el dashboard; enlaza al contrato o cambio de API.
- **Chore**: dependencias, Docker, CI.

Etiquetas como `backend`, `frontend`, `llm`, `infra` ayudan a filtrar el backlog.

## Projects (Kanban)

Columnas opcionales:

| Columna | Significado |
|---------|-------------|
| Backlog | Sin iniciar |
| En curso | Asignado y activo |
| Revisión | PR abierto |
| Hecho | Merge y verificación |

## Lista de validación (antes de entregar)

- [ ] `GET /api/health` OK con el stack en marcha.
- [ ] Swagger accesible y flujos de auth probables (`/api/docs/en` o `/api/docs/pt`).
- [ ] Frontend en `http://localhost:3001` (valores por defecto Docker).
- [ ] Subida de PDF → extracción completada y datos en la UI o BD.
- [ ] Rutas admin vs usuario respetan RBAC (`ADMIN` / `USER`).
- [ ] Evidencia: grabación corta o capturas + enlaces de Issue/PR.

## Vídeo de ejecución

La ruta **vídeo** de este sitio apunta al vídeo oficial de ejecución del proyecto (YouTube).

> Versión: 1.0.0
