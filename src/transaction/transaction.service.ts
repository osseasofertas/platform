import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(userId: number, data: { type: string; amount: number; description: string }) {
    return this.prisma.transaction.create({
      data: {
        ...data,
        userId,
        date: new Date(),
      },
    });
  }
}