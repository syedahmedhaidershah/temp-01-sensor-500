import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GetCurrentUser, Public, Roles } from 'src/common/decorators';
import { Role } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards';
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
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  @Post('logout/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogout(
    @Req() req: Request,
    @GetCurrentUser('_id') userId: string,
  ): Promise<void> {
    const { user } = req;
    console.log({ user });
    return this.authService.adminLogout(userId);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async userRefreshTokens(
    @GetCurrentUser('_id') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    // @Request req: Request,
  ) {
    // const { user } = req;
    return this.authService.refreshUserTokens(userId, refreshToken);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  @Post('refresh/admin')
  @HttpCode(HttpStatus.OK)
  async adminRefreshTokens(
    @GetCurrentUser('_id') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshAdminTokens(userId, refreshToken);
  }
}
