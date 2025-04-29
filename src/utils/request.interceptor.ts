import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const IgnoredRequestInterceptor = Symbol('IgnoredRequestInterceptor');

export function RequestInterceptorIgnore() {
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value[IgnoredRequestInterceptor] = true;
  };
}

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!context.getHandler()[IgnoredRequestInterceptor]) {
      let request = context.switchToHttp().getRequest();
      if (request.headers.authorization) {
        request.user = JSON.parse(
          atob(request.headers.authorization.split(' ').pop().split('.')[1]),
        );
      }
    }

    return next.handle();
  }
}
