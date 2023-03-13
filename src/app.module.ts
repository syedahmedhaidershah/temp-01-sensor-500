/** Core dependencies */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';



/** Third party dependencies */
import { SequelizeModule as SequelizeCoreModule } from '@nestjs/sequelize';



/** Local dependencies */
import { AppController } from './app.controller';

import { AppService } from './app.service';

import { MorganLoggerMiddleware } from './common/middlewares/morgan-logger/morgan-logger.middleware';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

import { AuthService } from './providers/auth/auth.service';
import { UsersService } from './providers/users/users.service';

import EnvironmentVariables from './common/interfaces/environmentVariables';

import { Sequelize } from './database';


/** Local configuration and declarations */
const {
  Models
} = Sequelize;

const {
  NODE_ENV,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
} = process.env as EnvironmentVariables;

let {
  MYSQL_ENABLED = 'false',
} = process.env as EnvironmentVariables;

MYSQL_ENABLED = JSON.parse(MYSQL_ENABLED as string);

const SequelizeModule = SequelizeCoreModule
  .forRoot({
    dialect: 'mysql',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    models: Models.default,
  });




@Module({
  imports: [
    AuthModule,
    UsersModule,
    ...(SequelizeModule && [SequelizeModule])
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    AuthService,
    UsersService
  ],
})
export class AppModule implements NestModule {
  /** Configuring middlewares */
  configure(consumer: MiddlewareConsumer) {
    if (NODE_ENV === 'devlocal') {
      consumer
        .apply(MorganLoggerMiddleware)
        .forRoutes('/');
    }
  }
}
