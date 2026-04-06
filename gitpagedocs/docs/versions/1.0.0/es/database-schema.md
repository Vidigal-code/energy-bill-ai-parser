# Esquema de Base de Datos Relacional (Prisma)

La persistencia comercial recae sobre el motor relacional de alta fiabilidad PostgreSQL, en gran medida abstraído por el modelo prisma (Prisma ORM) generando código tipado de migraciones continuas.

## Modelos Clave del Prisma Schema

### `User`
Almacena credenciales encriptadas y define el rango jerárquico dentro de la solución completa.
- **Relaciones:** `1-N` frente a facturas. `1-N` frente a Auditorías.
- **Campos Notables:** `passwordHash`, `role` (`ADMIN` o `USER`), `refreshToken`.

### Componentes de Facturación
Estos cimientos albergan metadatos de las facturas que están anclados a buckets en la nube.

- **`Invoice`**: Registro inmutable base por cada recibo cargado. Resguarda los identificadores y tokens (UUID) utilizados por el módulo de almacenamiento seguro S3 para desencriptarlos o localizarlos.
- **`InvoiceExtractedData`**: Objeto relacional `1-1` que absorbe lo que la red neuronal generativa dictamine. Traduce texto caótico de los PDF a llaves de valor determinístico como `numeroCliente`, `mesReferencia`, `consumoEnergiaEletricaKwh`. Al tener todo separado, consultar para dashboards es cuestión de milisegundos.

### `AuditLog`
El libro sagrado de actividad del portal administrativo. Una huella dactilar inborrable insertada por detrás de toda llamada REST a las API controladas.
- **Campos Notables:** `action`, `resource`, `ipAddress`, `operatorId`.
