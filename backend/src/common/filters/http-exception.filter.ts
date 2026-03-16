import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Ignore favicon 404 noise
    if (status === HttpStatus.NOT_FOUND && request.url.includes('favicon.ico')) {
      return response.status(status).end();
    }

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erreur interne du serveur';

    // User-friendly message for Throttler/Rate-limit errors
    if (exception && typeof exception === 'object' && exception.constructor.name === 'ThrottlerException') {
      message = 'Trop de tentatives. Veuillez réessayer plus tard.';
    }

    this.logger.error(`${request.method} ${request.url} → ${status}`, {
      exception: exception instanceof Error ? exception.message : String(exception),
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
