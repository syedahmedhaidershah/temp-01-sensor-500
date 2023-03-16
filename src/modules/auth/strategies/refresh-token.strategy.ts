import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../users/types';
import { Request } from 'express';
// import { jwtConstants } from './constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'refreshtokentest',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: User) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return { username: payload.username, refreshToken };
  }
}
