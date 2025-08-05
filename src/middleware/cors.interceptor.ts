import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CorsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest();

    // Log CORS-related requests
    if (request.method === 'OPTIONS') {
      this.logger.log(`CORS preflight request for ${request.path}`);
    }

    return next.handle().pipe(
      tap(() => {
        // Log successful responses for withdrawal endpoints
        if (request.path.includes('/withdrawal') || request.path.includes('/queue')) {
          this.logger.log(
            `Response sent for ${request.method} ${request.path}`,
          );
        }
      }),
    );
  }
} 