import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { ApiResponsePresenter } from '../presenters/api-response.presenter';
import { ApiLogger } from '../../logging/api-logger';

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<
  T,
  unknown
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    if (context.getType<'http'>() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((data) => {
        ApiLogger.logSuccess({
          path: request.url,
          method: request.method,
        });

        return ApiResponsePresenter.success({
          path: request.url,
          timestamp,
          data,
        });
      }),
    );
  }
}
