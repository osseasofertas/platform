import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log database queries in development
    if (process.env.NODE_ENV !== 'production') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Log database errors
    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });

    // Log database info
    this.$on('info', (e) => {
      this.logger.log('Database info:', e);
    });

    // Log database warnings
    this.$on('warn', (e) => {
      this.logger.warn('Database warning:', e);
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on?.('beforeExit', async () => {
      this.logger.log('Disconnecting from database...');
      await app.close();
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
  }
}
