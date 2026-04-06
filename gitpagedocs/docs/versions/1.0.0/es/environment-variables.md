# Variables de Entorno y Configuración

El software depende visceralmente del archivo global `.env` radicado en la base del proyecto conteniendo datos críticos de infraestructura.

## Variables Primarias

### Backend Settings
`PORT=3000`
`NODE_ENV=development`
`JWT_SECRET=super_secret_for_jwt`

### Base de Datos
`DATABASE_URL="postgresql://user:password@postgres:5432/energy_db?schema=public"`

### JWE Encryption Keys
`JWE_PRIVATE_KEY` y `JWE_PUBLIC_KEY`: Deben contener cadenas RSA válidas en formato Base64. El backend se rehusará a encender por seguridad si no existen.

### LLMs y el Motor AI
- `OPEN_SOURCE_IA=false` (Cambiar a true desconecta Gemini y enlaza el modo Ollama).
- `LLM_PROVIDER=gemini` (gemini | ollama)
- `GEMINI_API_KEY=""`
- `OLLAMA_NODE_URL="http://ollama:11434"`

### AWS S3 / LocalStack Mock
- `AWS_REGION=us-east-1`
- `AWS_ACCESS_KEY_ID="test"`
- `AWS_SECRET_ACCESS_KEY="test"`
- `AWS_S3_BUCKET_NAME="invoices-bucket"`
- `AWS_ENDPOINT="http://localstack:4566"` (Frena el tráfico evitando Amazon y redirigiéndolo al clúster local de desarrollo LocalStack minimizando costos a cero).
