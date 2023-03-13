/** Core dependencies */
import { Injectable } from '@nestjs/common';


/** Third party dependencis */
import { Sequelize } from 'sequelize-typescript';


@Injectable()
export class AppService {
  constructor(
    private sequelize: Sequelize,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  getHelloAuth(): string {
    return 'Auth required for hello world.';
  }
}
