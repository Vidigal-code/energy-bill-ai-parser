# Estratégia de Deployment

O deploy da aplicação **Energy Bill AI Parser** foca em orquestração baseada em contêineres, CI/CD unificado e total isolamento de hardware graças ao Docker e ambientes de Cloud Nativa.

## CI/CD 
Para que qualquer commit atinja produção:
- **Linting e Testes Unitários:** Ambas as suítes (Frontend e Backend) abortam builds se algum PR quebrar a coesão de estilo do ESLint ou testes do Jest.
- Estágio de Staging permite Quality Assurance (QA).

## Hosting Recomendado
- **Backend (NestJS API)**: Imagens devem ser encapsuladas em Registries (e.g. Docker Hub / AWS ECR) e hospedadas via orquestradores dinâmicos, preferencialmente **AWS ECS Fargate** ou gerenciadores Serverless, escalando perfeitamente devido a natureza stateless da API Nest.
- **Frontend (Next.js)**: Para aplicações Server-Side renderizadas pelo App Router, **Vercel** ou AWS Amplify garantem as respostas interativas com a menor latência na borda global (Edge).
- **Database (PostgreSQL)**: Jamais deve-se subir banco persistente em Docker Compose cru para grandes instâncias de produção. Serviços Managed Relational Data como **AWS RDS** são recomendáveis.
