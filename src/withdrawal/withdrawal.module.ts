import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [WithdrawalController],
  providers: [WithdrawalService, PrismaService],
  exports: [WithdrawalService],
})
export class WithdrawalModule {} 