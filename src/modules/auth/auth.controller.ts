import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Authorization, GetCurrentUser, Public } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { UserDto } from '../users/dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard, JwtRefreshAuthGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async userSignUp(@Body() dto: UserDto): Promise<Tokens> {
    return this.authService.userSignUp(dto);
  }

  @Public()
  @Post('signup/admin')
  @HttpCode(HttpStatus.CREATED)
  async adminSignUp(@Body() dto: UserDto): Promise<Tokens> {
    return this.authService.adminSignUp(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.userLogin(dto);
  }

  @Public()
  @Post('login/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.adminLogin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async userLogout(@GetCurrentUser('_id') userId: string): Promise<void> {
    return this.authService.userLogout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Authorization(Role.Admin, Role.SuperAdmin)
  @Post('logout/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogout(@GetCurrentUser('_id') userId: string): Promise<void> {
    return this.authService.adminLogout(userId);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async userRefreshTokens(
    @GetCurrentUser('_id') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshUserTokens(userId, refreshToken);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Authorization(Role.Admin, Role.SuperAdmin)
  @Post('refresh/admin')
  @HttpCode(HttpStatus.OK)
  async adminRefreshTokens(
    @GetCurrentUser('_id') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshAdminTokens(userId, refreshToken);
  }
}
