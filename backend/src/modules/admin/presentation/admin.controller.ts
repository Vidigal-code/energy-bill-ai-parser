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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post('users')
  createUser(@Body() body: AdminCreateUserDto) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: AdminUpdateUserDto) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('documents')
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
  updateInvoiceReferenceMonth(
    @Param('id') id: string,
    @Body('mesReferencia') mesReferencia: string,
  ) {
    return this.adminService.updateInvoiceReferenceMonth(id, mesReferencia);
  }

  @Delete('invoices/:id')
  deleteInvoice(@Param('id') id: string) {
    return this.adminService.deleteInvoice(id);
  }

  @Get('documents/:id/download')
  downloadDocument(@Param('id') id: string) {
    return this.adminService.downloadDocument(id);
  }

  @Delete('documents/:id')
  deleteDocument(@Param('id') id: string) {
    return this.adminService.deleteDocument(id);
  }

  @Get('audit-logs')
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
