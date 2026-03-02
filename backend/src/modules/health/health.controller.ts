import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/presentation/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'energy-bill-ai-parser-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
