import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WithdrawalService } from './withdrawal.service';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  // Test endpoint to check CORS
  @Get('test')
  async testEndpoint() {
    return { message: 'Withdrawal endpoint is working', timestamp: new Date().toISOString() };
  }

  // GET /withdrawal-queue - Get all pending withdrawal requests (admin only)
  @Get('queue')
  @UseGuards(JwtAuthGuard)
  async getWithdrawalQueue() {
    return this.withdrawalService.getWithdrawalQueue();
  }

  // GET /withdrawal-requests - Get user's withdrawal requests
  @Get('requests')
  @UseGuards(JwtAuthGuard)
  async getUserWithdrawalRequests(@Req() req) {
    return this.withdrawalService.getUserWithdrawalRequests(req.user.userId);
  }

  // POST /withdrawal-requests - Create a new withdrawal request
  @Post('requests')
  @UseGuards(JwtAuthGuard)
  async createWithdrawalRequest(
    @Req() req,
    @Body() body: { amount: number }
  ) {
    return this.withdrawalService.createWithdrawalRequest(req.user.userId, body.amount);
  }

  // POST /user/premium-reviewer - Make user a premium reviewer (admin only)
  @Post('user/premium-reviewer')
  @UseGuards(JwtAuthGuard)
  async makePremiumReviewer(@Body() body: { userId: number }) {
    return this.withdrawalService.makePremiumReviewer(body.userId);
  }

  // Additional admin endpoints for managing withdrawal requests
  @Post('requests/:id/approve')
  @UseGuards(JwtAuthGuard)
  async approveWithdrawalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string }
  ) {
    return this.withdrawalService.approveWithdrawalRequest(id, body.notes);
  }

  @Post('requests/:id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectWithdrawalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string }
  ) {
    return this.withdrawalService.rejectWithdrawalRequest(id, body.notes);
  }

  @Post('requests/:id/process')
  @UseGuards(JwtAuthGuard)
  async processWithdrawalRequest(@Param('id', ParseIntPipe) id: number) {
    return this.withdrawalService.processWithdrawalRequest(id);
  }

  // Get user's queue position
  @Get('queue-position')
  @UseGuards(JwtAuthGuard)
  async getUserQueuePosition(@Req() req) {
    const position = await this.withdrawalService.getUserQueuePosition(req.user.userId);
    return { queuePosition: position };
  }
} 