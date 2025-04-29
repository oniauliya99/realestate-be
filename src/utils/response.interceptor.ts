import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((providerResult) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: providerResult?.message ?? null,
        data: providerResult?.data ?? null,
      })),
    );
  }
}
// export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
// intercept(context: ExecutionContext, next: CallHandler<T>) {}
