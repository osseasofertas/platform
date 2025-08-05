import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WithdrawalService } from './withdrawal.service';

@Controller('withdrawal')
@UseGuards(JwtAuthGuard)
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  // GET /withdrawal-queue - Get all pending withdrawal requests (admin only)
  @Get('queue')
  async getWithdrawalQueue() {
    return this.withdrawalService.getWithdrawalQueue();
  }

  // GET /withdrawal-requests - Get user's withdrawal requests
  @Get('requests')
  async getUserWithdrawalRequests(@Req() req) {
    return this.withdrawalService.getUserWithdrawalRequests(req.user.userId);
  }

  // POST /withdrawal-requests - Create a new withdrawal request
  @Post('requests')
  async createWithdrawalRequest(
    @Req() req,
    @Body() body: { amount: number }
  ) {
    return this.withdrawalService.createWithdrawalRequest(req.user.userId, body.amount);
  }

  // POST /user/premium-reviewer - Make user a premium reviewer (admin only)
  @Post('user/premium-reviewer')
  async makePremiumReviewer(@Body() body: { userId: number }) {
    return this.withdrawalService.makePremiumReviewer(body.userId);
  }

  // Additional admin endpoints for managing withdrawal requests
  @Post('requests/:id/approve')
  async approveWithdrawalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string }
  ) {
    return this.withdrawalService.approveWithdrawalRequest(id, body.notes);
  }

  @Post('requests/:id/reject')
  async rejectWithdrawalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string }
  ) {
    return this.withdrawalService.rejectWithdrawalRequest(id, body.notes);
  }

  @Post('requests/:id/process')
  async processWithdrawalRequest(@Param('id', ParseIntPipe) id: number) {
    return this.withdrawalService.processWithdrawalRequest(id);
  }

  // Get user's queue position
  @Get('queue-position')
  async getUserQueuePosition(@Req() req) {
    const position = await this.withdrawalService.getUserQueuePosition(req.user.userId);
    return { queuePosition: position };
  }
} 