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
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
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

  @Public()
  @Post('login')
  login(@Body() body: LoginDto, @Ip() ip: string, @Req() request: Request) {
    return this.authService.login(body, {
      ip,
      userAgent: this.normalizeUserAgent(request.headers['user-agent']),
    });
  }

  @Public()
  @Post('refresh')
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
  logout(@Body() body: RefreshTokenDto, @CurrentUser() user: AuthUser) {
    return this.authService.logout(body, user.sub);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.sub);
  }

  @Patch('me')
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
