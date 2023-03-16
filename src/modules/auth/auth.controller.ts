import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtAuthGuard, JwtRefreshAuthGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  // @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req.user);
  }
}
