import { NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/shared/config/server-env';
import { setSessionCookies } from '@/shared/api/server-auth';

export async function POST(request: Request) {
  const body = await request.json();
  const backendUrl = getBackendApiUrl();

  const response = await fetch(`${backendUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as {
    success: boolean;
    data?: {
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
  };

  const nextResponse = NextResponse.json(json, { status: response.status });
  if (response.ok && json.success && json.data) {
    setSessionCookies(nextResponse, json.data);
  }
  return nextResponse;
}
