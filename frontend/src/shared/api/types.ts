export type ApiSuccess<T> = {
  success: true;
  path: string;
  timestamp: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  path: string;
  timestamp: string;
  error: {
    statusCode: number;
    message: string;
    details?: unknown;
  };
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export function unwrapApiResponse<T>(payload: ApiEnvelope<T>): T {
  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  return payload.data;
}
