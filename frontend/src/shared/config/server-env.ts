export function getBackendApiUrl(): string {
  return (
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    'http://localhost:3000'
  );
}

export const ACCESS_TOKEN_COOKIE = 'ebill_access_token';
export const REFRESH_TOKEN_COOKIE = 'ebill_refresh_token';
