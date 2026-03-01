export type ApiSuccessResponse<T> = {
  success: true;
  path: string;
  timestamp: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  path: string;
  timestamp: string;
  error: {
    statusCode: number;
    message: string | string[];
    details?: unknown;
  };
};

export class ApiResponsePresenter {
  static success<T>(params: {
    path: string;
    data: T;
    timestamp?: string;
  }): ApiSuccessResponse<T> {
    return {
      success: true,
      path: params.path,
      timestamp: params.timestamp ?? new Date().toISOString(),
      data: params.data,
    };
  }

  static error(params: {
    path: string;
    statusCode: number;
    message: string | string[];
    details?: unknown;
    timestamp?: string;
  }): ApiErrorResponse {
    return {
      success: false,
      path: params.path,
      timestamp: params.timestamp ?? new Date().toISOString(),
      error: {
        statusCode: params.statusCode,
        message: params.message,
        details: params.details,
      },
    };
  }
}
