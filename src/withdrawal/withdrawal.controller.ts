import { Controller, Get, Post, Body, Param, UseGuards, Req, ParseIntPipe, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WithdrawalService } from './withdrawal.service';

@Controller('withdrawal')
@UseGuards(JwtAuthGuard)
export class WithdrawalController {
  private readonly logger = new Logger(WithdrawalController.name);
  
  constructor(private readonly withdrawalService: WithdrawalService) {}

  // GET /withdrawal-queue - Get all pending withdrawal requests (admin only)
  @Get('queue')
  async getWithdrawalQueue() {
    try {
      this.logger.log('Getting withdrawal queue');
      return await this.withdrawalService.getWithdrawalQueue();
    } catch (error) {
      this.logger.error('Error getting withdrawal queue:', error);
      throw new HttpException(
        'Failed to get withdrawal queue',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // GET /withdrawal-requests - Get user's withdrawal requests
  @Get('requests')
  async getUserWithdrawalRequests(@Req() req) {
    try {
      this.logger.log(`Getting withdrawal requests for user ${req.user.userId}`);
      return await this.withdrawalService.getUserWithdrawalRequests(req.user.userId);
    } catch (error) {
      this.logger.error(`Error getting withdrawal requests for user ${req.user.userId}:`, error);
      throw new HttpException(
        'Failed to get withdrawal requests',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // POST /withdrawal-requests - Create a new withdrawal request
  @Post('requests')
  async createWithdrawalRequest(
    @Req() req,
    @Body() body: { amount: number }
  ) {
    try {
      this.logger.log(`Creating withdrawal request for user ${req.user.userId} with amount ${body.amount}`);
      return await this.withdrawalService.createWithdrawalRequest(req.user.userId, body.amount);
    } catch (error) {
      this.logger.error(`Error creating withdrawal request for user ${req.user.userId}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create withdrawal request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // POST /user/premium-reviewer - Make user a premium reviewer (admin only)
  @Post('user/premium-reviewer')
  async makePremiumReviewer(@Body() body: { userId: number }) {
    try {
      this.logger.log(`Making user ${body.userId} a premium reviewer`);
      return await this.withdrawalService.makePremiumReviewer(body.userId);
    } catch (error) {
      this.logger.error(`Error making user ${body.userId} premium reviewer:`, error);
      throw new HttpException(
        'Failed to make user premium reviewer',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Additional admin endpoints for managing withdrawal requests
  @Post('requests/:id/approve')
  async approveWithdrawalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string }
  ) {
    try {
      this.logger.log(`Approving withdrawal request ${id}`);
      return await this.withdrawalService.approveWithdrawalRequest(id, body.notes);
    } catch (error) {
      this.logger.error(`Error approving withdrawal request ${id}:`, error);
      throw new HttpException(
        'Failed to approve withdrawal request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('requests/:id/reject')
  async rejectWithdrawalRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string }
  ) {
    try {
      this.logger.log(`Rejecting withdrawal request ${id}`);
      return await this.withdrawalService.rejectWithdrawalRequest(id, body.notes);
    } catch (error) {
      this.logger.error(`Error rejecting withdrawal request ${id}:`, error);
      throw new HttpException(
        'Failed to reject withdrawal request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('requests/:id/process')
  async processWithdrawalRequest(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log(`Processing withdrawal request ${id}`);
      return await this.withdrawalService.processWithdrawalRequest(id);
    } catch (error) {
      this.logger.error(`Error processing withdrawal request ${id}:`, error);
      throw new HttpException(
        'Failed to process withdrawal request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Get user's queue position
  @Get('queue-position')
  async getUserQueuePosition(@Req() req) {
    try {
      this.logger.log(`Getting queue position for user ${req.user.userId}`);
      const position = await this.withdrawalService.getUserQueuePosition(req.user.userId);
      this.logger.log(`User ${req.user.userId} queue position: ${position}`);
      return { queuePosition: position };
    } catch (error) {
      this.logger.error(`Error getting queue position for user ${req.user.userId}:`, error);
      throw new HttpException(
        'Failed to get queue position',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 