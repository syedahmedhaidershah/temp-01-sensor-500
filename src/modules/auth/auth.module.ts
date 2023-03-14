/** Core dependencies */
import { Module } from '@nestjs/common';



/** Third party dependencies */
import { PassportModule } from '@nestjs/passport';

import { SequelizeModule as SequelizeCoreModule } from '@nestjs/sequelize';

import { Sequelize } from '../../database';



/** Local dependencies */
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';



/** Local constants and statis */

import EnvironmentVariables from 'src/common/interfaces/environmentVariables';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { RouterModule } from '@nestjs/core';



/** Local configuration and declarations */
const {
  Models
} = Sequelize;

const {
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
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    LocalStrategy,
  ],
  imports: [
    UsersModule,
    PassportModule,
  ],
})
export class AuthModule { }
