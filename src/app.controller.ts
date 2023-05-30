/** Core depndencies */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get('health-check')
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return 'ok';
  }
}
