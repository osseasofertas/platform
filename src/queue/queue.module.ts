import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { WithdrawalModule } from '../withdrawal/withdrawal.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WithdrawalModule,
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {} 