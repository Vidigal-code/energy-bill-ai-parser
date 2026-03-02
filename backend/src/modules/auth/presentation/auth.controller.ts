import {
  Body,
  Controller,
  Get,
  Ip,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import type { AuthUser } from '../domain/auth-user.type';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Auth')
@Controller('auth')
/**
 *
 * EN: Authentication controller exposing register/login/refresh/logout and self-profile endpoints.
 *
 * PT: Controller de autenticacao com endpoints de registro/login/refresh/logout e auto perfil.
 *
 * @params Request decorators and auth DTO payloads from HTTP layer.
 * @returns Standardized API responses from auth application service.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * EN: Public endpoint to register a new user and start authenticated session.
   *
   * PT: Endpoint publico para registrar novo usuario e iniciar sessao autenticada.
   *
   * @params body Registration payload.
   * @params ip Request IP address.
   * @params request Raw request metadata.
   * @returns Session tokens and user data.
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'Usuário registrado com sucesso' })
  register(
    @Body() body: RegisterDto,
    @Ip() ip: string,
    @Req() request: Request,
  ) {
    return this.authService.register(body, {
      ip,
      userAgent: this.normalizeUserAgent(request.headers['user-agent']),
    });
  }

  /**
   *
   * EN: Public endpoint to authenticate user credentials.
   *
   * PT: Endpoint publico para autenticar credenciais do usuario.
   *
   * @params body Login payload.
   * @params ip Request IP address.
   * @params request Raw request metadata.
   * @returns Session tokens and user data.
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login realizado com sucesso' })
  login(@Body() body: LoginDto, @Ip() ip: string, @Req() request: Request) {
    return this.authService.login(body, {
      ip,
      userAgent: this.normalizeUserAgent(request.headers['user-agent']),
    });
  }

  /**
   *
   * EN: Public endpoint to rotate refresh token and keep session active.
   *
   * PT: Endpoint publico para rotacionar refresh token e manter sessao ativa.
   *
   * @params body Refresh token payload.
   * @params ip Request IP address.
   * @params request Raw request metadata.
   * @returns Renewed session token pair.
   */
  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Gerar novo access token via refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Token renovado com sucesso' })
  refresh(
    @Body() body: RefreshTokenDto,
    @Ip() ip: string,
    @Req() request: Request,
  ) {
    return this.authService.refresh(body, {
      ip,
      userAgent: this.normalizeUserAgent(request.headers['user-agent']),
    });
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerrar sessão do usuário' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'Logout realizado com sucesso' })
  logout(@Body() body: RefreshTokenDto, @CurrentUser() user: AuthUser) {
    return this.authService.logout(body, user.sub);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiOkResponse({ description: 'Perfil retornado com sucesso' })
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.sub);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ description: 'Perfil atualizado com sucesso' })
  updateProfile(@CurrentUser() user: AuthUser, @Body() body: UpdateProfileDto) {
    return this.authService.updateProfile(user.sub, body);
  }

  private normalizeUserAgent(userAgent: string | string[] | undefined) {
    if (Array.isArray(userAgent)) {
      return userAgent[0];
    }

    return userAgent;
  }
}
