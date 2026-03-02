import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/presentation/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar saúde da API' })
  @ApiOkResponse({ description: 'API operacional' })
  check() {
    return {
      status: 'ok',
      service: 'energy-bill-ai-parser-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
