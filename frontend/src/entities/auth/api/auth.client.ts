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
  const response = await authHttp.post<ApiEnvelope<AuthTokensPayload>>(
    '/register',
    payload,
  );
  return unwrapApiResponse(response.data).user;
}

export async function loginRequest(payload: Credentials): Promise<AuthUser> {
  const response = await authHttp.post<ApiEnvelope<AuthTokensPayload>>(
    '/login',
    payload,
  );
  return unwrapApiResponse(response.data).user;
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
