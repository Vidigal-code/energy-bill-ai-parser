import { config as loadEnv } from 'dotenv';
import { defineConfig } from "prisma/config";

// Prefer repository root .env and fallback to backend .env if present.
loadEnv({ path: '../.env' });
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
