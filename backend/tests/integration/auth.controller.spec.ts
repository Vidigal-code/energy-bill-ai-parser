import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { ExecutionContext } from '@nestjs/common';
import request from 'supertest';
import { AuthService } from '../../src/modules/auth/application/auth.service';
import { AuthController } from '../../src/modules/auth/presentation/auth.controller';
import { JwtAuthGuard } from '../../src/modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/presentation/guards/roles.guard';

describe('AuthController (integration)', () => {
  let app: INestApplication;

  const authServiceMock = {
    register: jest.fn().mockResolvedValue({ accessToken: 'token-register' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'token-login' }),
    refresh: jest.fn().mockResolvedValue({ accessToken: 'token-refresh' }),
    logout: jest.fn().mockResolvedValue({ message: 'ok' }),
    me: jest.fn().mockResolvedValue({
      id: 'user_1',
      email: 'user@test.local',
      username: 'user',
      role: 'USER',
    }),
    updateProfile: jest.fn().mockResolvedValue({
      id: 'user_1',
      email: 'user@test.local',
      username: 'updated',
      role: 'USER',
    }),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const httpRequest = ctx.switchToHttp().getRequest<{
            user?: {
              sub: string;
              email: string;
              username: string;
              role: 'USER' | 'ADMIN';
            };
          }>();
          httpRequest.user = {
            sub: 'user_1',
            email: 'user@test.local',
            username: 'user',
            role: 'USER',
          };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve executar register', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).post('/auth/register').send({
      email: 'new@test.local',
      username: 'newuser',
      password: 'Admin@123456',
    });
    const body = response.body as { accessToken: string };
    expect(response.status).toBe(201);
    expect(body.accessToken).toBe('token-register');
  });

  it('deve executar me com usuário autenticado', async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const response = await request(server).get('/auth/me');
    const body = response.body as { id: string };
    expect(response.status).toBe(200);
    expect(body.id).toBe('user_1');
  });
});
