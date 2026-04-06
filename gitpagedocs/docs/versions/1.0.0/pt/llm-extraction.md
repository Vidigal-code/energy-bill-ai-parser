# Integração LLM e Extração de Faturas

O processo de "Smart OCR" da Plataforma não usa algoritmos de texto rústicos. Ele se comunica diretamente com motores de Inteligência Artificial GenAI (Modelos Multimodais/Visão) para abstrair estruturalmente o conteúdo financeiro dos PDFs das faturas.

## Motor Principal (Google Gemini)

Adotamos a **Gemini API** como motor chefe impulsionado pelo modelo 2.0-flash. 
Diferentemente de modelos de conversas triviais, o Gemini recebe diretamente o `application/pdf` pela API. Isso maximiza a adesão e confiabilidade regulatória, visto que o backend apenas delega o parseamento do próprio arquivo *como é*, livre de manipulações por bibliotecas prévias de Node.js de extração falhas.

### Como o Fluxo Ocorre:
1. O backend carrega o Base64 do PDF validado.
2. Anexa-se o **Prompt rigoroso de JSON** configurado no servidor.
3. Dispara a query multimodal pro SDK Oficial conectando a Nuvem Google.
4. O resultado stringificado JSON é validado por Regex, parseado pelo TypeScript e injetado perfeitamente nas tabelas Prisma.

## Motor Offline Open-Source (Ollama)
Buscando ambientes que exigem ser executados de forma local (Air-gapped), um mecanismo Factory Pattern em NestJS possibilita uma mudança drástica apontando a aplicação offline.
Se o sistema for comutado para Ollama no arquivo `.env` global, ele chama uma lib *GhostScript/Pdf2pic*, intercepta a 1ª página principal de metadados, rasteriza numa imagem limpa em milisegundos e insere diretamente no pipeline de Visão de modelos contidos no seu servidor rodando LlamaVision.

## Contratos
O arquivo central na arquitetura Nest `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts` firma a tipagem de todo LLM a responder exatamente qual chave pertencerá as métricas de consumo GDI e Energia, unificando a integração.
