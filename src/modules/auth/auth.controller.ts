import { All, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  // @UseGuards(AuthGuard('local'))
  getHelloAuth(): string {
    return this.authService.getHelloAuth();
  }
}
