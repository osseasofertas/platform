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
}