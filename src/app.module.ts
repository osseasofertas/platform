import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ importe aqui

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { StatsModule } from './stats/stats.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ carregamento do .env automático
    UserModule,
    AuthModule,
    TransactionModule,
    StatsModule,
    EvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
