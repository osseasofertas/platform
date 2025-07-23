import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: '9f2a56c19ed84726b1d1d9a2fce6e202f06bffae60f16343ad7705e19c5d2f03', // Troque por uma variável de ambiente em produção!
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
