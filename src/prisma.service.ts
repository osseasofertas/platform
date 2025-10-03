import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      this.logger.log('Attempting to connect to database...');
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      this.logger.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on?.('beforeExit', async () => {
      await app.close();
    });
  }
}
