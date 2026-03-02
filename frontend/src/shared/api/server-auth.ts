import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getBackendApiUrl,
} from '@/shared/config/server-env';

type BackendAuthPayload = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: 'ADMIN' | 'USER';
  };
};

function parseDurationInSeconds(rawDuration: string): number {
  if (rawDuration.endsWith('m')) return Number(rawDuration.slice(0, -1)) * 60;
  if (rawDuration.endsWith('h')) return Number(rawDuration.slice(0, -1)) * 3600;
  if (rawDuration.endsWith('d')) return Number(rawDuration.slice(0, -1)) * 86400;
  return 900;
}

export function setSessionCookies(
  response: NextResponse,
  payload: BackendAuthPayload,
) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, payload.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseDurationInSeconds(payload.accessTokenExpiresIn),
    path: '/',
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseDurationInSeconds(payload.refreshTokenExpiresIn),
    path: '/',
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
}

export async function getServerAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getServerRefreshToken() {
  return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function refreshAccessTokenIfNeeded() {
  const refreshToken = await getServerRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const backendUrl = getBackendApiUrl();
  const response = await fetch(`${backendUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    success: boolean;
    data?: BackendAuthPayload;
  };

  if (!json.success || !json.data) {
    return null;
  }

  return json.data;
}
