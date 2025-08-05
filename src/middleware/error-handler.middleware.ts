import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ErrorHandlerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const logger = this.logger; // Store reference to logger

    res.send = function (body) {
      try {
        // Log withdrawal-related errors
        if (req.path.includes('/withdrawal') || req.path.includes('/queue')) {
          if (res.statusCode >= 400) {
            logger.error(`Withdrawal API Error: ${res.statusCode} - ${req.method} ${req.path}`, {
              body,
              userAgent: req.get('User-Agent'),
              ip: req.ip,
            });
          } else {
            logger.log(`Withdrawal API Success: ${res.statusCode} - ${req.method} ${req.path}`);
          }
        }

        return originalSend.call(this, body);
      } catch (error) {
        logger.error('Error in error handler middleware:', error);
        return originalSend.call(this, body);
      }
    };

    next();
  }
} 