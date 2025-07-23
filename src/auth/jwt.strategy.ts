import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '9f2a56c19ed84726b1d1d9a2fce6e202f06bffae60f16343ad7705e19c5d2f03', // Use variável de ambiente em produção!
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}