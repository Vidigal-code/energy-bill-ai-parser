# Segurança Crítica e RBAC

A plataforma **Energy Bill AI Parser** não possui vazamentos por design. Proteções fundamentais baseadas em JWT Assinado (JSON Web Tokens) ditam a vida útil e tráfego de dados. Todo conteúdo da plataforma usa a filosofia "Default Deny" (Negado por Padrão).

## Segurança via Guards do NestJS
Todas as controllers do projeto estão protegidas pelo `JwtAuthGuard` globalmente no nível das rotas de servidor.
Somente as rotas contendo uma anotação decoradora `@Public()` (como a rota de Login e Registro) conseguem burlar esta trava primária.

## Role-Based Access Control (RBAC)
Além do fator de autenticação, o fator de autorização dita o nível de soberania da conta:
- **Papel `USER`**:
  - Envia uploads de faturas restritos ao próprio ID (Tenant-Isolation).
  - Vê Dashboards calculando as métricas unicamente daquilo que seu ID importou.
- **Papel `ADMIN`**:
  - Possui a chave mestra para acessar estatísticas macros na rota `/api/admin/users`.
  - Pode ver todos audit-logs sem distinção.

### Como funciona o Decorador de `Roles`?
Nas rotas estritas, usamos `@Roles(Role.ADMIN)` atrelado ao `RolesGuard`. Isso inspeciona a extração de claims JWT validando o `user.role` gerado após o login seguro.

## JWE (JSON Web Encryption) de Armazenamento
Os metadados no banco e a fatura bruta PDF na S3 NUNCA flutuam soltos ou descriptografados ativamente na nuvem. A Biblioteca `node-jose` empacota com chave assimétrica RSA a URL da fatura antes da salva. O sistema apenas entende de volta se a Chave JWE Privada correspondente existir internamente nas instâncias rodando backend.
