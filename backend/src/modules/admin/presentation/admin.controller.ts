import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../application/admin.service';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/presentation/guards/roles.guard';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
} from './dto/admin-upsert-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Listar usuários (admin)' })
  @ApiOkResponse({ description: 'Usuários listados com sucesso' })
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post('users')
  @ApiOperation({ summary: 'Criar usuário (admin)' })
  @ApiBody({ type: AdminCreateUserDto })
  @ApiOkResponse({ description: 'Usuário criado com sucesso' })
  createUser(@Body() body: AdminCreateUserDto) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Atualizar usuário (admin)' })
  @ApiBody({ type: AdminUpdateUserDto })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  updateUser(@Param('id') id: string, @Body() body: AdminUpdateUserDto) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Remover usuário (admin)' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Listar documentos com filtros (admin)' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiOkResponse({ description: 'Documentos listados com sucesso' })
  listDocuments(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('username') username?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.adminService.listDocuments({
      fromDate,
      toDate,
      username,
      page,
      pageSize,
    });
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Listar faturas com filtros (admin)' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiOkResponse({ description: 'Faturas listadas com sucesso' })
  listInvoices(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('username') username?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.adminService.listInvoices({
      fromDate,
      toDate,
      username,
      page,
      pageSize,
    });
  }

  @Patch('invoices/:id/reference-month')
  @ApiOperation({ summary: 'Atualizar mês de referência da fatura (admin)' })
  @ApiOkResponse({ description: 'Mês de referência atualizado com sucesso' })
  updateInvoiceReferenceMonth(
    @Param('id') id: string,
    @Body('mesReferencia') mesReferencia: string,
  ) {
    return this.adminService.updateInvoiceReferenceMonth(id, mesReferencia);
  }

  @Delete('invoices/:id')
  @ApiOperation({ summary: 'Remover fatura (admin)' })
  @ApiOkResponse({ description: 'Fatura removida com sucesso' })
  deleteInvoice(@Param('id') id: string) {
    return this.adminService.deleteInvoice(id);
  }

  @Get('documents/:id/download')
  @ApiOperation({ summary: 'Baixar documento descriptografado (admin)' })
  @ApiOkResponse({ description: 'Documento retornado com sucesso' })
  downloadDocument(@Param('id') id: string) {
    return this.adminService.downloadDocument(id);
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Remover documento (admin)' })
  @ApiOkResponse({ description: 'Documento removido com sucesso' })
  deleteDocument(@Param('id') id: string) {
    return this.adminService.deleteDocument(id);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Listar logs de auditoria com filtros (admin)' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiOkResponse({ description: 'Logs de auditoria listados com sucesso' })
  listAuditLogs(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('username') username?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.adminService.listAuditLogs({
      fromDate,
      toDate,
      username,
      page,
      pageSize,
    });
  }
}
