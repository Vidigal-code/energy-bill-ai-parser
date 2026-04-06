# Stack Tecnológica

Explore as ferramentas e frameworks de mercado implementados no projeto:

## Frontend
- **React (v18) + Next.js (App Router):** Renderização focada no servidor e rotas de segurança.
- **Redux Toolkit & React Query:** Controle total do estato global, caches de API e gerenciamento de promises.
- **Tailwind CSS + Lucide React:** Estilização utilitária robusta e banco de ícones nativos escalonáveis.
- **Axios:** Para chamadas assíncronas ao backend, embutindo cookies de sessão (HTTP-only).

## Backend
- **Node.js + NestJS:** Framework principal proporcionando Controllers, Services, Pipes e Guards de altíssimo nível com tipagem estrita no ecossistema TypeScript.
- **Prisma ORM:** Moderno gerenciador para queries SQL gerando tipagens em tempo de compilação.
- **Node-Jose (JWE):** Responsável por garantir que toda a proteção do Payload criptografado seja feita via chaves e criptografia forte.

## Persistência e Integrações
- **PostgreSQL:** Banco de Dados central onde são criadas todas as tabelas transacionais.
- **LocalStack / AWS S3 SDK:** Simulação do ambiente cloud da Amazon localmente por containers, viabilizando integração em produção com repositório real de S3 em minutos.
- **Inteligência Artificial (Gemini & Ollama):** Provedores de SDK e APIs nativas para as requisições que entregam o poder principal da aplicação. 

## Ambiente & Deploy
- **Docker e Docker Compose:** Contêineres de todos os serviços (Frontend, Backend, Database, S3) em harmonia. Todos isolados.
- **ESLint, Prettier, Jest e Supertest:** Arsenal de testagem para validações Unitárias, Code Style rigoroso e e2e (integração).
