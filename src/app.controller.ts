/** Core depndencies */
import { Controller, Get, UseGuards } from '@nestjs/common';

/** Local dependencies and libraries */
import { AppService } from './app.service';

import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth')
  @UseGuards(JwtAuthGuard)
  getHelloAuth(): string {
    return this.appService.getHelloAuth();
  }
}
