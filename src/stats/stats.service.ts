import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { subDays, startOfDay } from 'date-fns';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: number) {
    const totalEvaluations = await this.prisma.evaluation.count({ where: { userId } });
    const totalEarned = await this.prisma.evaluation.aggregate({
      where: { userId },
      _sum: { earning: true },
    });
    const today = startOfDay(new Date());
    const todayEvaluations = await this.prisma.evaluation.count({
      where: { userId, completedAt: { gte: today } },
    });
    const weekAgo = subDays(today, 6);
    const weekEarnings = await this.prisma.evaluation.aggregate({
      where: { userId, completedAt: { gte: weekAgo } },
      _sum: { earning: true },
    });

    return {
      totalEvaluations,
      totalEarned: totalEarned._sum.earning || 0,
      todayEvaluations,
      weekEarnings: weekEarnings._sum.earning || 0,
    };
  }

  async getDaily(userId: number) {
    // Exemplo: últimos 7 dias
    const days = 7;
    const today = startOfDay(new Date());
    const result = [];
    for (let i = 0; i < days; i++) {
      const day = subDays(today, i);
      const nextDay = subDays(today, i - 1);
      const evaluations = await this.prisma.evaluation.findMany({
        where: {
          userId,
          completedAt: { gte: day, lt: nextDay },
        },
      });
      const earned = evaluations.reduce((sum, e) => sum + e.earning, 0);
      result.push({
        date: day,
        evaluations: evaluations.length,
        earned,
      });
    }
    return result.reverse();
  }
}