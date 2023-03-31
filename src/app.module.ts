/** Core dependencies */
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// import { RouterModule } from '@nestjs/core';

/** Third party dependencies */
import * as dotenv from 'dotenv';

/** Local dependencies */
import { AuthModule } from './modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MorganLoggerMiddleware } from './common/middlewares/morgan-logger/morgan-logger.middleware';

/** Local constants and statis */
import EnvironmentVariables from './common/interfaces/environmentVariables';
import { ChairModule } from './modules/chair/chair.module';
import { CheckExpiredToken } from './common/middlewares/check-expired-token';
import { ModelsModule } from './database/mongoose';
import { RouteInfo } from '@nestjs/common/interfaces';

import { JwtAuthGuardProvider } from './modules/auth/guards';
import { ResponseInterceptorProvider } from './common/interceptors';

/** Local configuration and declarations */
/** Setting up environment from env files if it exists, and environment isn't loaded */
dotenv.config();

const { NODE_ENV, MONGO_URL } = process.env as EnvironmentVariables;

const checkExpiredTokenRouteInfos: RouteInfo[] = [
  { path: 'auth/(.*)', method: RequestMethod.ALL },
  { path: 'health-check', method: RequestMethod.GET },
];

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(MONGO_URL),
    ModelsModule,
    ChairModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuardProvider, ResponseInterceptorProvider],
})
export class AppModule implements NestModule {
  /** Configuring middlewares */
  configure(consumer: MiddlewareConsumer) {
    if (NODE_ENV === 'devlocal') {
      consumer.apply(MorganLoggerMiddleware).forRoutes('/');
    }
    consumer
      .apply(CheckExpiredToken)
      .exclude(...checkExpiredTokenRouteInfos)
      .forRoutes('*');
  }
}
