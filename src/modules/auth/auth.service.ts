import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/types';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.validateUser(dto.username, dto.password);
    console.log({ user });
    if (!user) throw new ForbiddenException();
    const tokens = await this.getTokens(user.username);

    return tokens;
    // const payload = { username: user.username, _id: user._id };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }

  async signUp(dto: AuthDto) {
    return this.usersService.insertOne(dto);
  }

  async logout(user: User) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshTokens(user: User): Promise<Tokens> {
    const tokens = await this.getTokens(user.username);

    return tokens;
  }

  async getTokens(userName: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userName,
        },
        { secret: 'accesstokentest', expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        {
          userName,
        },
        {
          secret: 'refreshtokentest',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
