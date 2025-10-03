import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);

    // Configure CORS
    app.enableCors({
      origin: [
        'https://platform-production-f017.up.railway.app',
        'https://onlyreviewplat.vercel.app',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on port ${port}`);
    logger.log(`Health check available at http://localhost:${port}/health`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
