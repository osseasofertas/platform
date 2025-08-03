import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(name: string, email: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({
      data: { name, email, passwordHash },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async updateUser(id: number, data: { name?: string; paypalAccount?: string; bankAccount?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateEvaluationLimit(id: number, evaluationLimit: number) {
    return this.prisma.user.update({
      where: { id },
      data: { evaluationLimit },
    });
  }

  async updateVerificationStatus(id: number, isVerified: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isVerified },
    });
  }

  async updateVerifiedDate(id: number, verifiedDate: Date) {
    return this.prisma.user.update({
      where: { id },
      data: { verifiedDate },
    });
  }

  // New methods for withdrawal queue system
  async updateQueuePosition(id: number, queuePosition: number) {
    return this.prisma.user.update({
      where: { id },
      data: { queuePosition },
    });
  }

  async makePremiumReviewer(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isPremiumReviewer: true,
        premiumReviewerDate: new Date(),
      },
    });
  }

  async getQueuePosition(id: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { queuePosition: true },
    });
    return user?.queuePosition || 0;
  }

  async updateAllQueuePositions(): Promise<void> {
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
}