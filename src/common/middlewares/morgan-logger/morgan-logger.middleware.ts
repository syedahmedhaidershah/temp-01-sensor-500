/** Core dependencies */
import { Injectable, NestMiddleware } from '@nestjs/common';

/** Third party dependencies */
import * as morgan from 'morgan';

@Injectable()
export class MorganLoggerMiddleware implements NestMiddleware {
  use = morgan('dev');
}
