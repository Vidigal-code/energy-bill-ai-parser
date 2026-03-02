import { NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/shared/config/server-env';
import {
  getServerAccessToken,
  refreshAccessTokenIfNeeded,
  setSessionCookies,
} from '@/shared/api/server-auth';

export async function GET() {
  const backendUrl = getBackendApiUrl();
  let accessToken = await getServerAccessToken();

  if (!accessToken) {
    const refreshed = await refreshAccessTokenIfNeeded();
    if (!refreshed) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Nao autenticado.' },
        },
        { status: 401 },
      );
    }
    accessToken = refreshed.accessToken;
  }

  const response = await fetch(`${backendUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  const json = await response.json();
  const nextResponse = NextResponse.json(json, { status: response.status });

  if (!response.ok && response.status === 401) {
    const refreshed = await refreshAccessTokenIfNeeded();
    if (refreshed) {
      setSessionCookies(nextResponse, refreshed);
    }
  }

  return nextResponse;
}
