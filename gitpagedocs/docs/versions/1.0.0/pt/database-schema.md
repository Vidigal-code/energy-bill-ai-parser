# Esquema de Banco de Dados Relacional (Prisma)

A integridade estrutural e financeira é garantida por meio do banco de dados relacional (PostgreSQL), abstraído e controlado rigorosamente pelo mapeador Prisma ORM.

## Modelos Principais no Prisma Schema

### `User`
Mantém os registros autenticáveis e detalhes de permissões corporativas.
- **Relacionamentos:** `1-N` para Invoices (um usuário possui várias faturas enviadas). `1-N` para AuditLogs.
- **Campos chaves:** `passwordHash`, `role` (`ADMIN`, `USER`), `refreshToken`.

### Entidades de Faturamento
Estas tabelas guardam as faturas estruturadas e o conteúdo extraído via Inteligência Artificial.

- **`Invoice`**: Armazena de forma indexada e virtual a existência física do documento hospedado em nuvem. Cada linha contém as `keys` referenciando buckets criptografados da S3.
- **`InvoiceExtractedData`**: Tabela relacionada com link direto `1-1` à `Invoice`, guardando resultados da varredura de visão da IA num formato padronizado: `numeroCliente`, `mesReferencia`, `consumoEnergiaEletricaKwh`, e valores contábeis. Seu esquema relacional achatado permite criação de dashboads em Next.js com latências minúsculas e indexação impecável.

### `AuditLog`
O livro fiscal (ledger) de operações que garante a não-repúdio na plataforma. Toda ação de alta periculosidade envia um write assíncrono para esta tabela.
- **Campos notórios:** `action`, `resource`, `ipAddress`, `operatorId`.
