/** Core depndencies */
import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  @Public()
  @Get('health-check')
  getHello(): string {
    return 'ok';
  }
}
