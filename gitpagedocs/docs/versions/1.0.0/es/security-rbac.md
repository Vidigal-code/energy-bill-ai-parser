# Seguridad y Gestión de Acceso (RBAC)

La filosofía base de la suite **Energy Bill AI Parser** es "Prohibir por Padrón" (Default Deny), aplicando robustez inquebrantable a través de identificaciones asimétricas de JWT.

## Barricadas vía Guards en NestJS
La capa global de módulos está custodiada firmemente por el `JwtAuthGuard`. Nadie consume ningún endpoint comercial. Exclusivamente se levanta el escudo si los endpoints poseen la meta-anotación `@Public()`, la cual se aplica a zonas de registro o validación local de credenciales.

## Sistema RBAC Estricto (Role-Based Access Control)
Una vez validados, no significa poder absoluto. El nivel subyacente jerarquiza la vista:
- **Cuentas `USER`**:
  - Almacenan sus facturas y el identificador amarra la métrica visualmente a una caja blindada (Aislamiento de inquilino o Tenant-Isolation).
  - Listan resúmenes generados estrictamente por ellos.
- **Cuentas `ADMIN`**:
  - Dotadas del escudo para escanear `api/admin/users` manipulando y auditando.
  - Miran los rastros del todo el ecosistema (AuditLogs).

### Componente Lógico Decorador de Roles
El decorador `@Roles(Role.ADMIN)` acoplado al `RolesGuard` escanea la sesión JWT destilada y asegura limpiamente que poseas la llave administrativa necesaria emitiendo bloqueos tajantes 403 (Forbidden) al infractor.

## Encriptación JWE sobre la Web (JSON Web Encryption)
Jamás subimos a AWS S3 (o LocalStack) datos libres legibles. Se recurre a algoritmos RSA usando el módulo Node-Jose para envolver las llaves de AWS S3 generadas por nuestra arquitectura. Una extracción forzosa del bucket sólo generaría datos nulos protegidos con grado militar.
