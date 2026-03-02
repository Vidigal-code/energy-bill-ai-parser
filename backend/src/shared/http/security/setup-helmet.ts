import type { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

type SetupHelmetInput = {
  app: INestApplication;
  enabled: boolean;
};

export function setupHelmet(input: SetupHelmetInput): void {
  if (!input.enabled) {
    return;
  }

  input.app.use(
    helmet({
      // Swagger UI utiliza inline scripts/styles; CSP estrita quebra a doc interativa.
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-site' },
      frameguard: { action: 'deny' },
      referrerPolicy: { policy: 'no-referrer' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: false,
      },
    }),
  );
}
