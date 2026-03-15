# Integracoes e extensibilidade

Esta secao substitui o conteudo generico de "temas" por pontos reais de extensao do projeto.

## Providers de IA

Adapters disponiveis:

- `gemini` (padrao por suporte nativo multimodal a PDF)
- `openai`
- `claude`
- `ollama` (caminho local open-source)

Referencias de codigo:

- `backend/src/modules/llm/infrastructure/providers/*`
- `backend/src/modules/llm/application/extraction-response.parser.ts`

## Estrategia de providers

- Selecionado em runtime por `LLM_PROVIDER`
- Prompt/referencia/contexto podem ser injetados por env
- Saida e normalizada para o contrato de fatura

No caso de Ollama:

- a aplicacao pode converter a primeira pagina do PDF em imagem
- isso viabiliza fluxo local open-source quando nao existe upload PDF nativo

## Adapters de armazenamento

Abstracao principal de storage:

- Porta: `backend/src/modules/storage/domain/document-storage.port.ts`
- Adapter atual: implementacao S3 compativel

Drivers suportados:

- `localstack` para local/desenvolvimento
- `aws` para cloud

## Pontos de extensao em seguranca

- Integrar segredos com Vault/KMS
- Aplicar allowlist estrita de CORS
- Enriquecer metadata de auditoria para compliance

## Tema visual do frontend

O frontend atual usa Tailwind + convencao dark/light.

Para evoluir tema visual:

- centralizar design tokens em `frontend/src/shared`
- expor estado de tema no store global
- manter contraste consistente em dashboards e tabelas
