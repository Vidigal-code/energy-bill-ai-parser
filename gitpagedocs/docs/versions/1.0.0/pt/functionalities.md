# Funcionalidades

Mapa de funcionalidades do **energy-bill-ai-parser** alinhado ao código.

## Autenticação e utilizadores

- **Registo / login** com hash de palavra-passe e emissão de JWT.
- **Refresh token** e **logout**.
- **Perfil** do utilizador atual.
- **Papéis** `ADMIN` e `USER` aplicados em rotas e handlers.

## Faturas e processamento de PDF

- **Upload** de PDFs de faturas (multipart) com validação e metadados.
- **Pipeline de extração** que:
  - Escolhe o LLM ativo conforme configuração.
  - Envia o PDF (ou representação derivada conforme o provedor) ao modelo.
  - Mapeia a saída para o **contrato de extração** e persiste resultados.
- **Dashboards** e listagens filtradas por papel.

## Módulo LLM

- **Multi-provedor**: Gemini, OpenAI, Claude, Ollama, etc.
- **Seleção dinâmica** via ambiente / runtime.
- **Ollama**: pode converter páginas do PDF em imagens quando a API não aceita PDF (ver `README` na raiz para `OPEN_SOURCE_IA` e `LLM_PROVIDER`).

## Armazenamento e cifra

- **JWE** para payloads sensíveis antes do armazenamento quando aplicável.
- **S3-compatível**; **LocalStack** no Docker local.

## Administração

- APIs **admin** para utilizadores, documentos, faturas e visibilidade de auditoria (conforme implementação).
- **RBAC** para ações apenas de `ADMIN`.

## Auditoria

- Registos de **auditoria** para ações relevantes (dependente da configuração).

## API e documentação

- **Swagger** (`/api/docs/pt`, `/api/docs/en`).
- **Health** para orquestração e uptime.

## Documentação estática (este site)

- Páginas **Markdown**, rotas **HTML** (viewer de código) e **vídeo** com a execução do projeto.

> Versão: 1.0.0
