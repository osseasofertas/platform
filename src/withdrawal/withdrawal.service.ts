import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WithdrawalRequest, User } from '@prisma/client';

@Injectable()
export class WithdrawalService {
  constructor(private prisma: PrismaService) {}

  // Get withdrawal queue (all pending requests)
  async getWithdrawalQueue(): Promise<WithdrawalRequest[]> {
    return this.prisma.withdrawalRequest.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            queuePosition: true,
            isPremiumReviewer: true,
          },
        },
      },
      orderBy: [
        { user: { queuePosition: 'asc' } },
        { requestDate: 'asc' },
      ],
    });
  }

  // Get withdrawal requests for a specific user
  async getUserWithdrawalRequests(userId: number): Promise<WithdrawalRequest[]> {
    return this.prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { requestDate: 'desc' },
    });
  }

  // Create a new withdrawal request
  async createWithdrawalRequest(userId: number, amount: number): Promise<WithdrawalRequest> {
    // Check if user exists and has sufficient balance
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    // Check if user already has a pending request
    const existingRequest = await this.prisma.withdrawalRequest.findFirst({
      where: {
        userId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      throw new BadRequestException('You already have a pending withdrawal request');
    }

    // Create withdrawal request
    const withdrawalRequest = await this.prisma.withdrawalRequest.create({
      data: {
        userId,
        amount,
      },
    });

    // Deduct amount from user balance
    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: user.balance - amount },
    });

    return withdrawalRequest;
  }

  // Approve a withdrawal request
  async approveWithdrawalRequest(requestId: number, notes?: string): Promise<WithdrawalRequest> {
    const request = await this.prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Request is not pending');
    }

    return this.prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: {
        status: 'approved',
        processedDate: new Date(),
        notes,
      },
    });
  }

  // Reject a withdrawal request
  async rejectWithdrawalRequest(requestId: number, notes?: string): Promise<WithdrawalRequest> {
    const request = await this.prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Request is not pending');
    }

    // Refund the amount to user's balance
    await this.prisma.user.update({
      where: { id: request.userId },
      data: { balance: request.user.balance + request.amount },
    });

    return this.prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: {
        status: 'rejected',
        processedDate: new Date(),
        notes,
      },
    });
  }

  // Mark withdrawal as processed
  async processWithdrawalRequest(requestId: number): Promise<WithdrawalRequest> {
    const request = await this.prisma.withdrawalRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Withdrawal request not found');
    }

    if (request.status !== 'approved') {
      throw new BadRequestException('Request must be approved before processing');
    }

    return this.prisma.withdrawalRequest.update({
      where: { id: requestId },
      data: {
        status: 'processed',
        processedDate: new Date(),
      },
    });
  }

  // Update user to premium reviewer
  async makePremiumReviewer(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isPremiumReviewer: true,
        premiumReviewerDate: new Date(),
      },
    });
  }

  // Get user by ID
  async getUserById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Update queue positions (run daily)
  async updateQueuePositions(): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        isVerified: true,
        isPremiumReviewer: false,
      },
      orderBy: [
        { verifiedDate: 'asc' },
        { registrationDate: 'asc' },
      ],
    });

    for (let i = 0; i < users.length; i++) {
      await this.prisma.user.update({
        where: { id: users[i].id },
        data: { queuePosition: i + 1 },
      });
    }
  }

  // Get user's queue position
  async getUserQueuePosition(userId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { queuePosition: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.queuePosition || 0;
  }
} 