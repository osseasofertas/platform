import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ importe aqui

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { StatsModule } from './stats/stats.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { QueueModule } from './queue/queue.module';
import { ErrorHandlerMiddleware } from './middleware/error-handler.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ carregamento do .env automático
    UserModule,
    AuthModule,
    TransactionModule,
    StatsModule,
    EvaluationModule,
    WithdrawalModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ErrorHandlerMiddleware)
      .forRoutes('*');
  }
}
