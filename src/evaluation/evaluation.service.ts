import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.evaluation.findMany({ where: { userId } });
  }

  async create(userId: number, data: { contentId: number; type: string; earning: number }) {
    return this.prisma.evaluation.create({
      data: { ...data, userId, completedAt: new Date() },
    });
  }
}