# API Endpoints

Recebe faturas de energia em PDF, extrai campos estruturados por um provedor multimodal, calcula indicadores e oferece listagem, dashboards, documentos e administração. O resultado deve ser conferido contra o PDF original; validação de esquema não garante que os números foram lidos corretamente.

## Fluxo e casos de falha

1. Login/cadastro → access token e refresh token → JwtAuthGuard/RolesGuard. USER consulta dados do próprio uploaderUserId; ADMIN possui consultas administrativas. RefreshToken armazena hash, jti, expiração, revogação e substituição; não documente o refresh como token sem estado. O inventário de controllers informa todas as rotas reais.

2. POST /api/invoices/extract recebe multipart no campo file. Arquivo ausente retorna 400; MIME diferente de application/pdf retorna 415; tamanho acima de PDF_MAX_FILE_SIZE_MB retorna 413. O arquivo é criptografado em JWE e enviado ao S3 antes da chamada ao extrator. A validação de MIME usada pelo caso de uso não equivale a inspeção completa de conteúdo.

3. OPEN_SOURCE_IA=true seleciona Ollama; caso contrário LLM_PROVIDER seleciona openai (padrão), gemini/google ou claude. O módulo usa adaptadores com HTTP, não um SDK Gemini obrigatório. Provedores validam a saída pelo contrato comum; Ollama usa conversão PDF/imagem. Modelo e endpoint vêm da configuração. ROLLBACK_ON_INVOICE_FAILURE é lido/logado no módulo, mas não desliga a limpeza do S3 no caso de uso atual.

4. Extração válida → cálculo → transação Prisma grava Invoice SUCCESS, InvoiceMetrics e StoredDocument → AuditLog SUCCESS → resposta com invoiceId, documentId, extraction e metrics. Consumo soma kWh de Energia Elétrica e SCEEE; compensada usa GD I; totalSemGD soma valores de Energia Elétrica, SCEEE e iluminação; economia usa valor de GD I. Não há conversão absoluta automática do sinal da economia.

5. Falha dentro do bloco de extração/persistência tenta remover o objeto S3, registra auditoria de erro e propaga a exceção. Falha de remoção gera warning. Upload inicial ocorre antes desse bloco; erro de auditoria após commit pode deixar registros persistidos com objeto removido. Os enums PROCESSING/ERROR existem no schema, mas este caso de uso não cria uma linha de fatura para cada tentativa malsucedida.

| Método e caminho | Declaração |
| --- | --- |
| `DELETE /api/admin/documents/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `DELETE /api/admin/invoices/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `DELETE /api/admin/users/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/audit-logs` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/documents/:id/download` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/documents` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/invoices` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/admin/users` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `GET /api/auth/me` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `GET /api/health` | [backend/src/modules/health/health.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/health/health.controller.ts) |
| `GET /api/invoices/dashboard/consolidated` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices/dashboard/energy` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices/dashboard/financial` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices/my-documents` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `GET /api/invoices` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |
| `PATCH /api/admin/invoices/:id/reference-month` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `PATCH /api/admin/users/:id` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `PATCH /api/auth/me` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/admin/users` | [backend/src/modules/admin/presentation/admin.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/admin/presentation/admin.controller.ts) |
| `POST /api/auth/login` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/auth/logout` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/auth/refresh` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/auth/register` | [backend/src/modules/auth/presentation/auth.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/auth/presentation/auth.controller.ts) |
| `POST /api/invoices/extract` | [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts) |

## Exemplo de requisição

```http
POST /api/invoices/extract HTTP/1.1
Authorization: Bearer <access-token>
Content-Type: multipart/form-data; boundary=invoice

--invoice
Content-Disposition: form-data; name="file"; filename="bill.pdf"
Content-Type: application/pdf

<PDF bytes>
--invoice--
```

## Arquivos relacionados

- [backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/application/process-invoice-extraction.use-case.ts)
- [backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts)
- [backend/src/modules/llm/llm.module.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/llm/llm.module.ts)
- [backend/src/modules/invoices/presentation/invoices.controller.ts](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/src/modules/invoices/presentation/invoices.controller.ts)
- [backend/prisma/schema.prisma](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/backend/prisma/schema.prisma)
- [docker-compose.yml](https://github.com/Vidigal-code/energy-bill-ai-parser/blob/00154f885896b294707fbf12ef0701a3d62630cd/docker-compose.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=19)
- [Source reference](?menu=pt&lang=pt&id=20)
