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

    // Add CORS headers manually if needed
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
    );
    response.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    response.header('Access-Control-Allow-Credentials', 'true');

    // Log CORS-related requests
    if (request.method === 'OPTIONS') {
      this.logger.log(`CORS preflight request for ${request.path}`);
    }

    return next.handle().pipe(
      tap(() => {
        // Log successful responses for withdrawal endpoints
        if (request.path.includes('/withdrawal') || request.path.includes('/queue')) {
          this.logger.log(
            `CORS response sent for ${request.method} ${request.path}`,
          );
        }
      }),
    );
  }
} 