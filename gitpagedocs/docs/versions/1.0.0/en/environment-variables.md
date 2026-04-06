# Environment Variables & Configuration

The application is heavily bound to the global `.env` file located exclusively on the project root. It dictates all architectural configurations.

## Primary Keys

### Backend Settings
`PORT=3000`
`NODE_ENV=development`
`JWT_SECRET=super_secret_for_jwt`

### Database
`DATABASE_URL="postgresql://user:password@postgres:5432/energy_db?schema=public"`

### JWE Encryption Keys
`JWE_PRIVATE_KEY` and `JWE_PUBLIC_KEY`: Should contain valid Base64-encoded RSA strings. The backend will halt boot operations to protect Invoices if these are invalid.

### LLMs and AI Engine
- `OPEN_SOURCE_IA=false` (Setting to true boots Ollama and unlinks Gemini)
- `LLM_PROVIDER=gemini` (gemini | ollama)
- `GEMINI_API_KEY=""`
- `OLLAMA_NODE_URL="http://ollama:11434"`

### AWS S3 / LocalStack Mock
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID="test"`
- `AWS_SECRET_ACCESS_KEY="test"`
- `AWS_S3_BUCKET_NAME="invoices-bucket"`
- `AWS_ENDPOINT="http://localstack:4566"` (Forces S3 traffic towards the local containerized LocalStack environment rather than Amazon's paid cloud).
