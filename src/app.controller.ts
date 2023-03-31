/** Core depndencies */
import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller('health-check')
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
