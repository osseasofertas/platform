import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new Error('Email já cadastrado');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(name, email, passwordHash);
    await this.prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'welcome_bonus',
        amount: 50,
        description: 'Welcome bonus',
        date: new Date(),
      },
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
