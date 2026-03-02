process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.LOGS = process.env.LOGS ?? 'false';
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
process.env.JWT_ISSUER = process.env.JWT_ISSUER ?? 'energy-bill-ai-parser-test';
