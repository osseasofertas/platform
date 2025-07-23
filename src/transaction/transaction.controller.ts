import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionService } from './transaction.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAll(@Req() req) {
    return this.transactionService.findAllByUser(req.user.userId);
  }

  @Post()
  async create(@Req() req, @Body() body: { type: string; amount: number; description: string }) {
    return this.transactionService.create(req.user.userId, body);
  }
}