import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './middleware/global-exception.filter';
import { CorsInterceptor } from './middleware/cors.interceptor';
import { validateDatabaseConfig } from './config/database.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Validate database configuration
    validateDatabaseConfig();
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Improved CORS configuration
    app.enableCors({
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://platform-production-f017.up.railway.app',
        'https://ospltform-front.vercel.app',
        'https://onlyplatformreviewer.vercel.app',
        'https://onlyplatformreviewer.vercel.app/',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
      exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Global prefix for API routes
    app.setGlobalPrefix('api');

    // Global error handling and interceptors
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new CorsInterceptor());
    app.useGlobalPipes();

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log('CORS and error handling configured successfully');
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
