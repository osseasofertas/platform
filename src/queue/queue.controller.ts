import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueueService } from './queue.service';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('update-positions')
  async updateQueuePositions() {
    await this.queueService.manualUpdateQueuePositions();
    return { message: 'Queue positions updated successfully' };
  }

  @Post('process')
  async processQueue() {
    await this.queueService.manualProcessQueue();
    return { message: 'Queue processing completed' };
  }
} 