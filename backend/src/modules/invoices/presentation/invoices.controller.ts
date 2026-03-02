import {
  BadRequestException,
  Controller,
  Get,
  Ip,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProcessInvoiceExtractionUseCase } from '../application/process-invoice-extraction.use-case';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/presentation/guards/roles.guard';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from '../../auth/domain/auth-user.type';
import type { Request } from 'express';
import { InvoicesQueryService } from '../application/invoices-query.service';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

type UploadedPdfFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly processInvoiceExtractionUseCase: ProcessInvoiceExtractionUseCase,
    private readonly invoicesQueryService: InvoicesQueryService,
  ) {}

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Enviar PDF e processar extração da fatura' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ description: 'Fatura processada com sucesso' })
  async extractInvoice(
    @UploadedFile() file: UploadedPdfFile | undefined,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
    @Req() request: Request,
  ) {
    if (!file) {
      const message = PtBrMessages.invoices.uploadFileRequired;
      ApiLogger.logError({
        path: '/api/invoices/extract',
        method: 'POST',
        statusCode: 400,
        message,
      });
      throw new BadRequestException(message);
    }

    return this.processInvoiceExtractionUseCase.execute({
      actorUserId: user.sub,
      fileName: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
      ip,
      userAgent: this.normalizeUserAgent(request.headers['user-agent']),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar faturas com filtros' })
  @ApiQuery({ name: 'numeroCliente', required: false })
  @ApiQuery({ name: 'mesReferencia', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiOkResponse({ description: 'Lista de faturas retornada com sucesso' })
  listInvoices(
    @CurrentUser() user: AuthUser,
    @Query('numeroCliente') numeroCliente?: string,
    @Query('mesReferencia') mesReferencia?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.invoicesQueryService.listInvoices({
      numeroCliente,
      mesReferencia,
      page,
      pageSize,
      userId: user.sub,
      role: user.role,
    });
  }

  @Get('dashboard/energy')
  @ApiOperation({ summary: 'Consultar dashboard de energia (kWh)' })
  @ApiOkResponse({ description: 'Dashboard de energia retornado com sucesso' })
  energyDashboard(@CurrentUser() user: AuthUser) {
    return this.invoicesQueryService.energyDashboard(user.sub, user.role);
  }

  @Get('dashboard/financial')
  @ApiOperation({ summary: 'Consultar dashboard financeiro (R$)' })
  @ApiOkResponse({
    description: 'Dashboard financeiro retornado com sucesso',
  })
  financialDashboard(@CurrentUser() user: AuthUser) {
    return this.invoicesQueryService.financialDashboard(user.sub, user.role);
  }

  @Get('my-documents')
  @ApiOperation({ summary: 'Listar documentos do usuário autenticado' })
  @ApiOkResponse({ description: 'Documentos retornados com sucesso' })
  myDocuments(@CurrentUser() user: AuthUser) {
    return this.invoicesQueryService.listMyDocuments(user.sub);
  }

  private normalizeUserAgent(userAgent: string | string[] | undefined) {
    if (Array.isArray(userAgent)) {
      return userAgent[0];
    }

    return userAgent;
  }
}
