# Arquitectura y Flujo del Sistema

La plataforma **Energy Bill AI Parser** ha sido diseñada en base a una arquitectura de microservicios lógicos, divididos entre un **Frontend** y un **Backend**, intercomunicados mediante APIs RESTful.

## Componentes Principales

1. **Frontend (Next.js + FSD):** 
   - Maneja la interfaz, paneles de control y auditoría.
   - Comunicación con el Backend vía Axios.
   - Desarrollada bajo el paradigma *Feature-Sliced Design* (FSD).

2. **Backend (NestJS):**
   - Cerebro de las reglas de negocio y procesamiento.
   - Administra subidas y extracciones inteligentes gracias a LLMs.
   - Administra RBAC (Control de Acceso basado en Roles) y Auditoría estricta.

3. **Base de Datos Relacional (PostgreSQL):**
   - Se orquesta a través de Prisma ORM para guardar Usuarios, Facturas, Métricas, Logs de auditoría e integraciones.

4. **Motor de Inteligencia Artificial (LLMs):**
   - Mecanismo que procesa PDFs y devuelve las respuestas estructuradas. Google Gemini API es el proveedor principal; Ollama se usa para entornos locales sin internet.

5. **Almacenamiento S3 (AWS S3 / LocalStack):**
   - Todas las facturas de la nube son protegidas utilizando encriptación en reposo, en este caso JWE (JSON Web Encryption), garantizando total confidencialidad.

## Diagrama de Flujo (Ejemplo de Subida de Factura)

1. El Usuario (`ADMIN` o `USER`) ingresa al Frontend y sube su recibo de luz (PDF).
2. El archivo llega al Backend (NestJS). Se le aplica encriptación JWE y se salva en un **Bucket S3**.
3. En paralelo, el archivo original es inyectado a la **API de Gemini** para lectura y análisis visual del documento (Vision).
4. El LLM extrae índices y métricas. El Backend captura esto, consolida los montos, e inserta todo en **Prisma/PostgreSQL**.
5. Los eventos de auditoría son registrados formalmente rastreando al autor, timestamp y detalles.
