# Visão Geral do Backend (NestJS)

O backend do **Energy Bill AI Parser** foi desenvolvido utilizando o framework **NestJS**, seguindo rígidos padrões de Injeção de Dependências, Modularidade e Abstração Tática. Todo o serviço foi tipado sob TypeScript garantindo integridade das requisições via DTOs (Data Transfer Objects).

## Estrutura Modular

A aplicação é fragmentada nos seguintes módulos:

- **`AuthModule`**: Cuida da autenticação (Login, Registro, Refresh Token, Sessões). Implanta instâncias do `JwtStrategy` e `LocalStrategy`.
- **`AdminModule`**: Protegido por Guards RBAC limitados à tag `ADMIN`. Controla gerenciamento forçado de usuários e acessos a logs gerais.
- **`InvoicesModule`**: Core de faturamento. Contém lógicas de uploads, persistência dos arquivos no bucket via `StorageModule` e aciona os `LLMs`.
- **`LLMModule`**: Implementa o Factory Pattern definindo se a requisição de Parsing vai para **Gemini**, **Ollama** ou **OpenAI**.
- **`StorageModule`**: Interage com o Cloud de armazenamento (S3/LocalStack) manipulando uploads e downloads criptografados.
- **`AuditModule`**: Interceptador silencioso para armazenar o trajeto de uso da aplicação para conformidade de segurança.

## Mecanismos Globais

- **Guards e Interceptors**: A aplicação conta com Proteção RBAC centralizada. Exceto em endpoints explicitamente liberados (Decorador `@Public()`), todo acesso exige token válido. O `ResponseInterceptor` formata as saídas na padronização `{ success: true, data: ... }`.
- **Filtros de Exceção**: Tratativas de erros HTTP evitam travamentos, revertendo exceções nativas em objetos JSON amigáveis descrevendo os códigos e naturezas do erro para o Frontend.
