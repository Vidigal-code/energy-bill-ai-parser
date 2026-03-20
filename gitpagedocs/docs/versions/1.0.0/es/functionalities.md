# Funcionalidades

Mapa funcional de `energy-bill-ai-parser`.

## Autenticacion

- Registro y login de usuario
- Flujo de refresh token y logout seguro
- Perfil del usuario autenticado
- Control por rol (`ADMIN`, `USER`)

## Procesamiento de facturas

- Endpoint de carga PDF
- Extraccion con abstraccion de providers IA:
  - `gemini`
  - `openai`
  - `claude`
  - `ollama`
- Normalizacion de salida estructurada
- Historial persistido con filtros

## Dashboards

- Dashboard de energia (`kWh`)
- Dashboard financiero (`R$`)
- Dashboard consolidado

## Administracion

- Gestion de usuarios
- Gobernanza de facturas y documentos
- Consulta de logs de auditoria
- Descarga y eliminacion segura de documentos

## Storage y auditoria

- Documento cifrado (JWE)
- Almacenamiento en bucket S3 compatible
- Trazabilidad de operaciones sensibles

## API + Docs + codigo

- Swagger en EN/PT
- Endpoint health para observabilidad
- Ruta de visualizacion de codigo en esta version
