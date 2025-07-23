import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from './stats.service.js';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  async getSummary(@Req() req) {
    return this.statsService.getSummary(req.user.userId);
  }

  @Get('daily')
  async getDaily(@Req() req) {
    return this.statsService.getDaily(req.user.userId);
  }
}