import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EvaluationService } from './evaluation.service';

@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Get()
  async getAll(@Req() req) {
    return this.evaluationService.findAllByUser(req.user.userId);
  }

  @Post()
  async create(@Req() req, @Body() body: { contentId: number; type: string; earning: number }) {
    return this.evaluationService.create(req.user.userId, body);
  }
}