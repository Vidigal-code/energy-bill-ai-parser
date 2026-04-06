# Estrategia de Despliegue

La puesta en marcha de **Energy Bill AI Parser** aterriza completamente sobre orquestadores de contenedores y un fuerte enfoque Cloud Native enfocado en aislar por completo el software.

## CI/CD (Integración Continua)
Para que cualquier aporte alcance producción segura:
- **Calidad y Testing:** El pipe de Git arrojará fallos si no se superan las exhaustivas reglas de Jest o estilo estático de ESLint. 
- Promoción obligada hacia ambientes QA de Pre-Producción (Staging).

## Infraestructura Recomendada de Hosting
- **Backend (NestJS API)**: Contenerizar la API y arrojarla a un registro corporativo (Ej. AWS ECR) ejecutándola sobre **AWS ECS Fargate** u otro servicio auto-escalable.
- **Frontend (Next.js)**: Empaquetar páginas del Server-Side sobre plataformas construidas nativamente para ello como **Vercel** asgurará una nula latencia Edge.
- **Base de Datos (PostgreSQL)**: Nunca sostener bases relacionales permanentes dentro del ecosistema salvaje simple de Docker Compose para entornos crudos de negocio real. Fiar la seguridad a servicios Managed como **AWS RDS**.
