import { NextResponse } from 'next/server';
import { getBackendApiUrl } from '@/shared/config/server-env';
import {
  getServerAccessToken,
  refreshAccessTokenIfNeeded,
  setSessionCookies,
} from '@/shared/api/server-auth';

async function proxy(request: Request, path: string[]) {
  const backendUrl = getBackendApiUrl();
  const targetUrl = `${backendUrl}/api/${path.join('/')}${new URL(request.url).search}`;
  const accessToken = await getServerAccessToken();

  const body =
    request.method === 'GET' || request.method === 'DELETE'
      ? undefined
      : await request.arrayBuffer();

  const makeRequest = async (token?: string) =>
    fetch(targetUrl, {
      method: request.method,
      headers: {
        ...(request.headers.get('content-type')
          ? { 'Content-Type': request.headers.get('content-type') as string }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? Buffer.from(body) : undefined,
      cache: 'no-store',
    });

  let response = await makeRequest(accessToken);
  let refreshedPayload: Awaited<ReturnType<typeof refreshAccessTokenIfNeeded>> =
    null;

  if (response.status === 401) {
    refreshedPayload = await refreshAccessTokenIfNeeded();
    if (refreshedPayload) {
      response = await makeRequest(refreshedPayload.accessToken);
    }
  }

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { success: false, error: { message: text || 'Erro inesperado.' } };
  }

  const nextResponse = NextResponse.json(payload, { status: response.status });
  if (refreshedPayload) {
    setSessionCookies(nextResponse, refreshedPayload);
  }
  return nextResponse;
}

type Params = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function POST(request: Request, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function PATCH(request: Request, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function DELETE(request: Request, { params }: Params) {
  return proxy(request, (await params).path);
}
