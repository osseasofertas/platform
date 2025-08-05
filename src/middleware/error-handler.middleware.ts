import {
  Injectable,
  NestMiddleware,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ErrorHandlerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const logger = this.logger; // Capture logger reference

    // Log incoming requests for withdrawal endpoints
    if (req.path.includes('/withdrawal') || req.path.includes('/queue')) {
      logger.log(
        `Incoming ${req.method} request to ${req.path} from ${req.ip}`,
      );
    }

    res.send = function (body) {
      try {
        // Log withdrawal-related responses
        if (req.path.includes('/withdrawal') || req.path.includes('/queue')) {
          if (res.statusCode >= 400) {
            logger.error(
              `Withdrawal API Error: ${res.statusCode} - ${req.method} ${req.path}`,
              {
                statusCode: res.statusCode,
                method: req.method,
                path: req.path,
                body: typeof body === 'string' ? body : JSON.stringify(body),
                userAgent: req.get('User-Agent'),
                ip: req.ip,
                headers: req.headers,
              },
            );
          } else {
            logger.log(
              `Withdrawal API Success: ${res.statusCode} - ${req.method} ${req.path}`,
            );
          }
        }

        return originalSend.call(this, body);
      } catch (error) {
        logger.error('Error in error handler middleware:', {
          error: error.message,
          stack: error.stack,
          path: req.path,
          method: req.method,
        });
        return originalSend.call(this, body);
      }
    };

    // Handle errors in the middleware
    const originalError = res.on;
    res.on = function (event, listener) {
      if (event === 'error') {
        logger.error(`Response error for ${req.method} ${req.path}:`, listener);
      }
      return originalError.call(this, event, listener);
    };

    next();
  }
} 