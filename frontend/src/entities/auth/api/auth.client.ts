'use client';

import axios from 'axios';
import { unwrapApiResponse, type ApiEnvelope } from '@/shared/api/types';
import type { AuthUser } from '../model/auth.types';

type AuthTokensPayload = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  user: AuthUser;
};

type Credentials = {
  email: string;
  password: string;
};

type RegisterPayload = Credentials & {
  username: string;
};

const authHttp = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
});

export async function registerRequest(payload: RegisterPayload): Promise<AuthUser> {
  try {
    const response = await authHttp.post<ApiEnvelope<AuthTokensPayload>>(
      '/register',
      payload,
    );
    return unwrapApiResponse(response.data).user;
  } catch (error) {
    throw new Error(resolveAuthErrorMessage(error));
  }
}

export async function loginRequest(payload: Credentials): Promise<AuthUser> {
  try {
    const response = await authHttp.post<ApiEnvelope<AuthTokensPayload>>(
      '/login',
      payload,
    );
    return unwrapApiResponse(response.data).user;
  } catch (error) {
    throw new Error(resolveLoginErrorMessage(error));
  }
}

export async function meRequest(): Promise<AuthUser> {
  const response = await authHttp.get<ApiEnvelope<AuthUser>>('/me');
  return unwrapApiResponse(response.data);
}

export async function logoutRequest(): Promise<void> {
  await authHttp.post('/logout');
}

export async function updateProfileRequest(payload: {
  username?: string;
  password?: string;
}): Promise<AuthUser> {
  const response = await authHttp.patch<ApiEnvelope<AuthUser>>('/me', payload);
  return unwrapApiResponse(response.data);
}

function resolveAuthErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (
      error.response?.data as { error?: { message?: string } } | undefined
    )?.error?.message;

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }

  return 'Credenciais invalidas.';
}

function resolveLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      return 'Usuario nao encontrado.';
    }
  }
  return 'Credenciais invalidas.';
}
