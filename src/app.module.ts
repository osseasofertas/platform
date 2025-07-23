import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { StatsModule } from './stats/stats.module';
import { EvaluationModule } from './evaluation/evaluation.module';

@Module({
  imports: [UserModule, AuthModule, TransactionModule, StatsModule, EvaluationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
