# Deployment Strategy

The **Energy Bill AI Parser** deployment methodology focuses heavily on containerization, CI/CD orchestration, and total hardware isolation courtesy of Docker and Cloud Native architectures.

## CI/CD 
For every commit targeting production:
- **Linting and Testing:** Both Frontend and Backend repositories will gracefully fail during builds if unit tests (`Jest`) or strict ESLint rules are violated.
- Staging endpoints enable reliable QA before production merging.

## Recommended Hosting Structure
- **Backend (NestJS API)**: Imaged inside Docker Registries (like AWS ECR) and hosted over Serverless engines such as **AWS ECS Fargate**. The stateless footprint scales automatically.
- **Frontend (Next.js)**: Full-stack meta-frameworks operate blazingly fast at global edges using platforms like **Vercel** or AWS Amplify Hosting.
- **Database (PostgreSQL)**: Bare metal Docker-Compose instances on single cheap droplets are highly discouraged for production SQL workloads. Utilize Managed DBs like **AWS RDS** or equivalents.
