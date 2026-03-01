import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponsePresenter } from '../presenters/api-response.presenter';
import { ApiLogger } from '../../logging/api-logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let details: unknown;

    if (exception instanceof HttpException) {
      const responsePayload = exception.getResponse();
      if (typeof responsePayload === 'string') {
        message = responsePayload;
      } else if (
        responsePayload &&
        typeof responsePayload === 'object' &&
        'message' in responsePayload
      ) {
        const payloadWithMessage = responsePayload as { message?: unknown };
        if (
          typeof payloadWithMessage.message === 'string' ||
          Array.isArray(payloadWithMessage.message)
        ) {
          message = payloadWithMessage.message;
        }
        details = responsePayload;
      }
    }

    ApiLogger.logError({
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
    });

    response.status(status).json(
      ApiResponsePresenter.error({
        path: request.url,
        statusCode: status,
        message,
        details,
      }),
    );
  }
}
