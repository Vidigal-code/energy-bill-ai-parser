import { NextResponse } from 'next/server';
import { clearSessionCookies, getServerRefreshToken } from '@/shared/api/server-auth';
import { getBackendApiUrl } from '@/shared/config/server-env';

export async function POST() {
  const backendUrl = getBackendApiUrl();
  const refreshToken = await getServerRefreshToken();

  if (refreshToken) {
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  }

  const response = NextResponse.json({
    success: true,
    data: { message: 'Logout realizado com sucesso.' },
  });
  clearSessionCookies(response);
  return response;
}
