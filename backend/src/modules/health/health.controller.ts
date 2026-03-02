import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/presentation/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
/**
 *
 * EN: Health controller for liveness probing and container checks.
 *
 * PT: Controller de saude para verificacao de liveness e checagens de container.
 *
 * @params none
 * @returns Lightweight API status payload.
 */
export class HealthController {
  /**
   *
   * EN: Returns API liveness metadata for monitoring and healthchecks.
   *
   * PT: Retorna metadados de disponibilidade da API para monitoramento e healthchecks.
   *
   * @params none
   * @returns Service status payload with timestamp.
   */
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
