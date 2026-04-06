# Variáveis de Ambiente e Configuração

O sistema roda fortemente amarrado ao arquivo `.env` inserido unicamente na raiz do projeto contendo as instruções infraestruturais.

## Variáveis Primárias

### Backend Settings
`PORT=3000`
`NODE_ENV=development`
`JWT_SECRET=super_secret_for_jwt`

### Banco de Dados
`DATABASE_URL="postgresql://user:password@postgres:5432/energy_db?schema=public"`

### JWE Keys
`JWE_PRIVATE_KEY` e `JWE_PUBLIC_KEY`: Devem conter Chaves RSA Geradas (formato string) em base64. A API barrará inicializações inseguras para resguardar as faturas.

### LLMs e AI Engine
- `OPEN_SOURCE_IA=false` (Liga Ollama local se verdadeiro e derruba Gemini)
- `LLM_PROVIDER=gemini` (gemini | ollama)
- `GEMINI_API_KEY=""`
- `OLLAMA_NODE_URL="http://ollama:11434"`

### AWS S3 / LocalStack Mock
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID="test"`
- `AWS_SECRET_ACCESS_KEY="test"`
- `AWS_S3_BUCKET_NAME="invoices-bucket"`
- `AWS_ENDPOINT="http://localstack:4566"` (Mantém o envio travado no container LocalStack nativo de desenvolvimento ao invés da cloud externa).

> Mantenha sempre `.env.example` sincronizado evitando poluir o versionamento git com chaves expostas.
