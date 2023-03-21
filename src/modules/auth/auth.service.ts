import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { checkIfAdmin, compareHashed, hashData } from 'src/utilities';
import { UserDto } from '../users/dto';
import { UserType } from '../users/types';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto';
import { Tokens } from './types';
import * as dotenv from 'dotenv';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';

dotenv.config();

const { JWT_SECRET_ACCESS_TOKEN_KEY, JWT_SECRET_REFRESH_TOKEN_KEY } =
  process.env as EnvironmentVariables;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async userLogin(dto: LoginDto): Promise<Tokens> {
    const user = await this.validateUser(dto.username, dto.password);
    if (!user) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.usersService.updateUserRtHash(user._id, tokens.refresh_token);

    return tokens;
  }

  async adminLogin(dto: LoginDto): Promise<Tokens> {
    const user = await this.validateAdmin(dto.username, dto.password);
    if (!user) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.usersService.updateAdminRtHash(user._id, tokens.refresh_token);

    return tokens;
  }

  async userSignUp(dto: UserDto): Promise<Tokens> {
    const hashedPassword = await hashData(dto.password);
    dto.password = hashedPassword;
    const createdUser = await this.usersService.createUser(dto);

    const tokens = await this.getTokens(createdUser);
    await this.usersService.updateUserRtHash(
      createdUser._id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async adminSignUp(dto: UserDto): Promise<Tokens> {
    const isAdminRole = checkIfAdmin(dto.roles);

    if (!isAdminRole) throw new ForbiddenException('Access Denied');

    const hashedPassword = await hashData(dto.password);
    dto.password = hashedPassword;
    const createdUser = await this.usersService.createAdminUser(dto);

    const tokens = await this.getTokens(createdUser);
    await this.usersService.updateAdminRtHash(
      createdUser._id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async userLogout(userId: string): Promise<void> {
    return this.usersService.logoutUser(userId);
  }

  async adminLogout(userId: string): Promise<void> {
    return this.usersService.logoutAdminUser(userId);
  }

  async refreshUserTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.hashed_rt) throw new ForbiddenException('Access denied');

    const rtMatches = await compareHashed(rt, user.hashed_rt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user);
    await this.usersService.updateUserRtHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async refreshAdminTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.usersService.findAdminUserById(userId);
    if (!user || !user.hashed_rt) throw new ForbiddenException('Access denied');

    const rtMatches = await compareHashed(rt, user.hashed_rt);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user);
    await this.usersService.updateAdminRtHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async validateUser(username: string, pass: string): Promise<UserType | null> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) throw new NotFoundException('No User Found');
    const passwordMatches = await compareHashed(pass, user.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    return user;
  }

  async validateAdmin(
    username: string,
    pass: string,
  ): Promise<UserType | null> {
    const user = await this.usersService.findAdminUserByUsername(username);
    if (!user) throw new NotFoundException('No User Found');
    const passwordMatches = await compareHashed(pass, user.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    return user;
  }

  async getTokens(user: UserType): Promise<Tokens> {
    const { username, _id, roles } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
          _id,
          roles,
        },
        { secret: JWT_SECRET_ACCESS_TOKEN_KEY, expiresIn: 60 * 15 },
      ),
      this.jwtService.signAsync(
        {
          username,
          _id,
          roles,
        },
        {
          secret: JWT_SECRET_REFRESH_TOKEN_KEY,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
