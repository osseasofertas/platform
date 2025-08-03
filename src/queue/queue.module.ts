import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { WithdrawalModule } from '../withdrawal/withdrawal.module';

@Module({
  imports: [
    WithdrawalModule,
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {} 