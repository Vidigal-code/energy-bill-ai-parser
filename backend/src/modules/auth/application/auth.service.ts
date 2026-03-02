import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuditStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { durationToSeconds } from '../../../shared/config/duration.util';
import { ApiLogger } from '../../../shared/logging/api-logger';
import { PtBrMessages } from '../../../shared/messages/pt-br.messages';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { AppRole } from '../domain/role.type';
import { LoginDto } from '../presentation/dto/login.dto';
import { RefreshTokenDto } from '../presentation/dto/refresh-token.dto';
import { RegisterDto } from '../presentation/dto/register.dto';
import { UpdateProfileDto } from '../presentation/dto/update-profile.dto';

type SessionContext = {
  ip?: string;
  userAgent?: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureDefaultAdmin();
  }

  async register(input: RegisterDto, context: SessionContext) {
    ApiLogger.info({
      context: 'AuthService',
      message: PtBrMessages.logs.auth.registeringUser,
    });
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      select: { id: true },
    });
    if (existingByEmail) {
      throw new BadRequestException(PtBrMessages.auth.emailAlreadyExists);
    }

    const existingByUsername = await this.prisma.user.findUnique({
      where: { username: input.username },
      select: { id: true },
    });
    if (existingByUsername) {
      throw new BadRequestException(PtBrMessages.auth.usernameAlreadyExists);
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await this.prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.username,
        passwordHash,
        role: 'USER',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'AUTH_REGISTER',
        resourceType: 'USER',
        resourceId: user.id,
        status: AuditStatus.SUCCESS,
        message: PtBrMessages.auth.userRegistered,
        ip: context.ip,
        userAgent: context.userAgent,
      },
    });

    return this.issueTokens(
      user.id,
      user.email,
      user.username,
      user.role,
      context,
    );
  }

  async login(input: LoginDto, context: SessionContext) {
    ApiLogger.info({
      context: 'AuthService',
      message: PtBrMessages.logs.auth.authenticatingUser,
    });
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException(PtBrMessages.auth.invalidCredentials);
    }

    const validPassword = await argon2.verify(
      user.passwordHash,
      input.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException(PtBrMessages.auth.invalidCredentials);
    }

    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'AUTH_LOGIN',
        resourceType: 'USER',
        resourceId: user.id,
        status: AuditStatus.SUCCESS,
        message: PtBrMessages.auth.loginSuccess,
        ip: context.ip,
        userAgent: context.userAgent,
      },
    });

    return this.issueTokens(
      user.id,
      user.email,
      user.username,
      user.role,
      context,
    );
  }

  async refresh(input: RefreshTokenDto, context: SessionContext) {
    ApiLogger.info({
      context: 'AuthService',
      message: PtBrMessages.logs.auth.refreshingSession,
    });
    const payload = this.verifyRefreshToken(input.refreshToken);

    const persistedToken = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
      include: { user: true },
    });
    if (
      !persistedToken ||
      persistedToken.revokedAt ||
      !persistedToken.user.isActive
    ) {
      throw new UnauthorizedException(PtBrMessages.auth.invalidRefreshToken);
    }

    const validTokenHash = await argon2.verify(
      persistedToken.tokenHash,
      input.refreshToken,
    );
    if (!validTokenHash) {
      await this.revokeTokenFamily(payload.sub);
      throw new UnauthorizedException(PtBrMessages.auth.invalidRefreshToken);
    }

    await this.prisma.refreshToken.update({
      where: { id: persistedToken.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(
      persistedToken.user.id,
      persistedToken.user.email,
      persistedToken.user.username,
      persistedToken.user.role,
      context,
    );
  }

  async logout(input: RefreshTokenDto, actorUserId: string) {
    ApiLogger.info({
      context: 'AuthService',
      message: PtBrMessages.logs.auth.loggingOutUser(actorUserId),
    });
    const payload = this.verifyRefreshToken(input.refreshToken);
    if (payload.sub !== actorUserId) {
      throw new UnauthorizedException(
        PtBrMessages.auth.tokenDoesNotBelongToAuthenticatedUser,
      );
    }

    await this.prisma.refreshToken.updateMany({
      where: {
        userId: actorUserId,
        jti: payload.jti,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId,
        action: 'AUTH_LOGOUT',
        resourceType: 'USER',
        resourceId: actorUserId,
        status: AuditStatus.SUCCESS,
        message: PtBrMessages.auth.logoutSuccess,
      },
    });

    return { message: PtBrMessages.auth.logoutSuccess };
  }

  async me(userId: string) {
    ApiLogger.info({
      context: 'AuthService',
      message: PtBrMessages.logs.auth.loadingAuthenticatedUser(userId),
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException(PtBrMessages.auth.userNotFound);
    }
    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    ApiLogger.info({
      context: 'AuthService',
      message: PtBrMessages.logs.auth.updatingAuthenticatedUserProfile(userId),
    });
    const updateData: { username?: string; passwordHash?: string } = {};

    if (input.username) {
      const existing = await this.prisma.user.findUnique({
        where: { username: input.username },
        select: { id: true },
      });
      if (existing && existing.id !== userId) {
        throw new BadRequestException(PtBrMessages.auth.usernameAlreadyExists);
      }
      updateData.username = input.username;
    }

    if (input.password) {
      updateData.passwordHash = await argon2.hash(input.password);
    }

    if (!Object.keys(updateData).length) {
      throw new BadRequestException(PtBrMessages.auth.noDataForUpdate);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'USER_UPDATE_PROFILE',
        resourceType: 'USER',
        resourceId: userId,
        status: AuditStatus.SUCCESS,
        message: PtBrMessages.auth.profileUpdated,
      },
    });

    return updatedUser;
  }

  private async ensureDefaultAdmin() {
    const email = this.configService.get<string>('DEFAULT_ADMIN_EMAIL');
    const username = this.configService.get<string>('DEFAULT_ADMIN_USERNAME');
    const password = this.configService.get<string>('DEFAULT_ADMIN_PASSWORD');
    if (!email || !username || !password) {
      return;
    }

    const existingAdmin = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { username }],
      },
      select: { id: true },
    });

    if (existingAdmin) {
      return;
    }

    const passwordHash = await argon2.hash(password);
    const admin = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        passwordHash,
        role: 'ADMIN',
      },
    });

    ApiLogger.warning({
      context: 'Auth',
      message: PtBrMessages.logs.auth.defaultAdminCreated(admin.email),
    });
  }

  private async issueTokens(
    userId: string,
    email: string,
    username: string,
    role: AppRole,
    context: SessionContext,
  ) {
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const issuer =
      this.configService.get<string>('JWT_ISSUER') ?? 'energy-bill-ai-parser';
    const refreshJti = randomUUID();
    const accessExpiresSeconds = durationToSeconds(accessExpiresIn);
    const refreshExpiresSeconds = durationToSeconds(refreshExpiresIn);

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, username, role },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessExpiresSeconds,
        issuer,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, jti: refreshJti, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresSeconds,
        issuer,
      },
    );

    const refreshTokenHash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + refreshExpiresSeconds * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        jti: refreshJti,
        tokenHash: refreshTokenHash,
        expiresAt,
        userAgent: context.userAgent,
        ip: context.ip,
      },
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: accessExpiresIn,
      refreshTokenExpiresIn: refreshExpiresIn,
      user: { id: userId, email, username, role },
    };
  }

  private verifyRefreshToken(refreshToken: string): {
    sub: string;
    jti: string;
  } {
    try {
      const payload = this.jwtService.verify<{ sub: string; jti: string }>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      return payload;
    } catch {
      throw new UnauthorizedException(PtBrMessages.auth.invalidRefreshToken);
    }
  }

  private async revokeTokenFamily(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
