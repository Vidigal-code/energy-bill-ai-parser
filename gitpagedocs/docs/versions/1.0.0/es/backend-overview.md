# Visión General del Backend (NestJS)

El backend de **Energy Bill AI Parser** ha sido estructurado mediante el poderoso framework colaborativo **NestJS**, respetando la abstracción, inyección de dependencias y la modularidad inquebrantable. Todas las transferencias de red son evaluadas en duro bajo DTOs (Data Transfer Objects) compilables de TypeScript.

## Estructura de Módulos

Los siguientes módulos rigen la orquestación:

- **`AuthModule`**: Lógica de entrada al sistema, Registros, Generación de Tokens JWT y refrescos mediante rutinas Passport locales.
- **`AdminModule`**: Bloqueado mediante Guards orientados al rol `ADMIN` que expone la gestión cruda sobre facturas y la auditoría.
- **`InvoicesModule`**: Donde habita la lógica comercial. Se encarga desde recibir el form-data con PDFs hasta persistirlos (vía `StorageModule`) y mandar procesos con IA (`LLMModule`).
- **`LLMModule`**: Una fábrica de proveedores. Elige de manera inteligente enviar el análisis hacia el clúster local de **Ollama** o hacia **Gemini** en la nube.
- **`StorageModule`**: Responsable de traficar los flujos de lectura y escritura directos a la nube S3/LocalStack.
- **`AuditModule`**: Tracker constante en la base de datos para registrar los eventos y quién operó cada ruta en específico.

## Mecanismos Globales Aplicados

- **Guardianes e Interceptores**: La regla inicial del ecosistema es "Bloquear acceso hasta proveer JWT", salvo que la ruta incluya el decorador `@Public()`. Asimismo, el `ResponseInterceptor` procesa las respuestas emitiendo una capa estandarizada `{ success: true, data: ... }` hacia el Frontend.
- **Filtros de Excepcionales**: Un bloque seguro centralizado procesando los errores nativos de servidor para traducirlos limpiamente en paquetes JSON legibles.
