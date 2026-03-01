import { z } from 'zod';

const OPEN_SOURCE_IA_VALUES = ['true', 'false'] as const;
const LLM_PROVIDER_VALUES = ['ollama', 'openai', 'gemini', 'claude'] as const;

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.coerce.number().int().positive().optional().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  OPEN_SOURCE_IA: z.enum(OPEN_SOURCE_IA_VALUES).optional().default('true'),
  LLM_PROVIDER: z.enum(LLM_PROVIDER_VALUES).optional().default('ollama'),
  OLLAMA_BASE_URL: z
    .string()
    .url()
    .optional()
    .default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().min(1).optional().default('llama3.2-vision'),
  ROLLBACK_ON_INVOICE_FAILURE: z
    .enum(OPEN_SOURCE_IA_VALUES)
    .optional()
    .default('true'),
  LOGS: z.enum(OPEN_SOURCE_IA_VALUES).optional().default('true'),
  INVOICE_EXTRACTION_REFERENCE: z.string().optional(),
  INVOICE_EXTRACTION_PROMPT: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;
