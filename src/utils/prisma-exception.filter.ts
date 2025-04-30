import { ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const logger = new Logger();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (!(exception instanceof PrismaClientKnownRequestError)) {
      logger.error(`${exception.message} Exception`);
      super.catch(exception, host);
      return;
    }
    logger.error(
      `Prisma Error - ${exception.code} - ${exception.message} - ${exception.meta}`,
    );
    switch (exception.code) {
      case 'P2002': {
        response.status(HttpStatus.CONFLICT).send({
          statusCode: HttpStatus.CONFLICT,
          exceptionCode: exception.code,
          message: `Unique Constraint ${exception.meta?.target}`,
        });
        break;
      }
      case 'P2003': {
        response.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          exceptionCode: exception.code,
        });
        break;
      }
      case 'P2025': {
        const target = exception.message.split(' ')[1];
        response.status(HttpStatus.NOT_FOUND).send({
          statusCode: HttpStatus.NOT_FOUND,
          exceptionCode: exception.code,
          message: `${target} not found`,
        });
        break;
      }
      default: {
        super.catch(exception, host);
        break;
      }
    }
  }
}
