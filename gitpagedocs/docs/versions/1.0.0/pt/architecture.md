# Arquitetura e Fluxo do Sistema

A Plataforma **Energy Bill AI Parser** foi projetada usando uma arquitetura baseada em microsserviços lógicos divididos entre um **Frontend** e um **Backend**, conectados através de APIs RESTFul. 

## Componentes Principais

1. **Frontend (Next.js + FSD):** 
   - Gerencia a interface, painéis administrativos e dashboards.
   - Comunicação via Axios com o Backend.
   - Padrão arquitetural *Feature-Sliced Design* (FSD).

2. **Backend (NestJS):**
   - Coração do processamento e regras de negócio.
   - Controla o upload e a extração inteligente via LLMs.
   - Gestão RBAC e Auditoria centralizada.

3. **Banco de Dados Relacional (PostgreSQL):**
   - Orquestrado via Prisma ORM para salvar Usuários, Perfis, Faturas, Métricas, Logs de auditoria e configurações.

4. **Motor de IA (LLMs):**
   - O núcleo do sistema, enviando PDFs parseados ou binários de imagem para obter chaves e valores na extração. Gemini API é o motor primário multimodal; Ollama para ambientes offline e fallback.

5. **Armazenamento de Arquivos S3 (AWS S3 / LocalStack):**
   - Armazena todas as faturas convertidas em um bucket, encriptadas através de JWE (JSON Web Encryption) para máxima segurança na nuvem.

## Diagrama de Fluxo (Exemplo do Upload de Fatura)

1. Usuário (`ADMIN` ou `USER`) acessa o Frontend e realiza upload do PDF da conta de luz.
2. O arquivo vai para o Backend (NestJS). O backend assina o arquivo com JWE e salva no **Bucket S3**.
3. Em paralelo, o arquivo PDF é enviado direto para a **Gemini API** para processamento visual do documento (Vision).
4. O LLM extrai métricas financeiras (Consumo, Compensação GDI, Iluminação). O Backend intercepta, consolida os cálculos, e salva os resultados utilizando **Prisma/PostgreSQL**.
5. Eventos de auditoria são criados (quem enviou, quando, qual arquivo, e o ID de log).
