# API Endpoints (Swagger)

A aplicação disponibiliza a sua interface REST através de rotas estritamente tipadas e documentadas via OpenAPI (Swagger).

## Swagger Interativo

Nosso backend do NestJS instancia dinamicamente servidores Swagger para facilitar os testes de integração.
- **Swagger PT-BR:** `http://localhost:3000/api/docs/pt`
- **Swagger EN:** `http://localhost:3000/api/docs/en`

Você pode acessar essas rotas no ambiente local de desenvolvimento para ler contratos DTO.

## Endpoints Principais

### Auth (`/api/auth`)
- `POST /api/auth/register`: Cria um novo usuário.
- `POST /api/auth/login`: Autentica o usuário devolvendo tokens JWT (Access e Refresh) limitados.
- `POST /api/auth/refresh`: Atualiza a validade do Token expirado.
- `GET /api/auth/profile`: Retorna o DTO de usuário da JWT ativa (Protegido).

### Invoices (`/api/invoices`)
- `POST /api/invoices/upload`: Rota Multipart Form Data contendo `file` (PDF longo ou pequeno). Protegido, fará push ao S3 e ao LLM Engine simultaneamente. Retorna a Fatura (InvoiceDTO) e Seus extraídos.
- `GET /api/invoices`: Lista paginada das faturas, filtrável por Cliente e por status RBAC (Users só veem suas próprias).
- `GET /api/invoices/:id`: Retorna os detalhes de uma específica.
- `GET /api/invoices/dashboard/metrics`: Abstrai relatórios contábeis de faturas já consolidadas e computadas.

### Admin (`/api/admin`)
- `GET /api/admin/users`: Visualiza e edita a rede inteira de utilizadores (Obrigatório ser `ADMIN`).
- `GET /api/admin/audit-logs`: Visualiza o histórico permanente da tabela inalterável e as ações de usuários logados.
