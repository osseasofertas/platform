import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req) {
    // req.user vem do JWT
    return this.userService.findById(req.user.userId);
  }

  @Patch()
  async updateProfile(@Req() req, @Body() body: { name?: string; paypalAccount?: string; bankAccount?: string }) {
    return this.userService.updateUser(req.user.userId, body);
  }

  @Patch('evaluation-limit')
  async updateEvaluationLimit(@Req() req, @Body() body: { evaluationLimit: number }) {
    return this.userService.updateEvaluationLimit(req.user.userId, body.evaluationLimit);
  }

  @Patch('verify')
  async updateVerificationStatus(@Req() req, @Body() body: { isVerified: boolean }) {
    return this.userService.updateVerificationStatus(req.user.userId, body.isVerified);
  }
}