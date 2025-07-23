import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [StatsService, PrismaService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}

