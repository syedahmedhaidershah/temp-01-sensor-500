/** Core depndencies */
import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller('test')
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
