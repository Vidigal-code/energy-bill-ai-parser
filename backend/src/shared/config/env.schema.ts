import { z } from 'zod';

const BOOLEAN_FLAG_VALUES = ['true', 'false'] as const;
const LLM_PROVIDER_VALUES = [
  'ollama',
  'openai',
  'gemini',
  'google',
  'claude',
] as const;

const booleanFlagSchema = z
  .string()
  .trim()
  .transform((value) => value.toLowerCase())
  .pipe(z.enum(BOOLEAN_FLAG_VALUES));

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.coerce.number().int().positive().optional().default(3000),
  HELMET_ENABLED: booleanFlagSchema.optional().default('true'),
  RATE_LIMIT_TTL_MS: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(60000),
  RATE_LIMIT_LIMIT: z.coerce.number().int().positive().optional().default(100),
  SWAGGER_ENABLED: booleanFlagSchema.optional().default('true'),
  SWAGGER_PATH: z.string().min(1).optional().default('api/docs'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).optional().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).optional().default('7d'),
  JWT_ISSUER: z.string().min(1).optional().default('energy-bill-ai-parser'),
  JWE_SECRET: z.string().min(32, 'JWE_SECRET must be at least 32 characters'),
  DEFAULT_ADMIN_EMAIL: z
    .string()
    .email()
    .optional()
    .default('admin@local.test'),
  DEFAULT_ADMIN_USERNAME: z.string().min(3).optional().default('admin'),
  DEFAULT_ADMIN_PASSWORD: z.string().min(8).optional().default('Admin@123456'),
  STORAGE_DRIVER: z
    .enum(['aws', 'localstack'])
    .optional()
    .default('localstack'),
  S3_REGION: z.string().min(1).optional().default('us-east-1'),
  S3_BUCKET: z.string().min(1).optional().default('energy-bills'),
  S3_ENDPOINT: z.string().url().optional().default('http://localhost:4566'),
  S3_ACCESS_KEY_ID: z.string().min(1).optional().default('test'),
  S3_SECRET_ACCESS_KEY: z.string().min(1).optional().default('test'),
  S3_FORCE_PATH_STYLE: booleanFlagSchema.optional().default('true'),
  OPEN_SOURCE_IA: booleanFlagSchema.optional().default('false'),
  LLM_PROVIDER: z.enum(LLM_PROVIDER_VALUES).optional().default('gemini'),
  OLLAMA_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().min(1).optional().default('llama3.2-vision'),
  OPENAI_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('https://api.openai.com/v1'),
  OPENAI_MODEL: z.string().min(1).optional().default('gpt-4.1-mini'),
  GEMINI_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('https://generativelanguage.googleapis.com/v1beta'),
  GEMINI_MODEL: z.string().min(1).optional().default('gemini-2.5-flash'),
  ANTHROPIC_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('https://api.anthropic.com/v1'),
  ANTHROPIC_MODEL: z
    .string()
    .min(1)
    .optional()
    .default('claude-3-5-sonnet-latest'),
  PDF_MAX_FILE_SIZE_MB: z.coerce.number().positive().optional().default(50),
  ROLLBACK_ON_INVOICE_FAILURE: booleanFlagSchema.optional().default('true'),
  LOGS: booleanFlagSchema.optional().default('true'),
  INVOICE_EXTRACTION_REFERENCE: z.string().optional(),
  INVOICE_EXTRACTION_PROMPT: z.string().optional(),
  INVOICE_EXTRACTION_CONTEXT: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;
