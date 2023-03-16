/** Core dependencies */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';

/** Local configuration and declarations */
/** Setting up environment from env files if it exists, and environment isn't loaded */
dotenv.config();

const { NODE_ENV, MONGO_URL } = process.env as EnvironmentVariables;

@Module({
  imports: [AuthModule, MongooseModule.forRoot(MONGO_URL)],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule implements NestModule {
  /** Configuring middlewares */
  configure(consumer: MiddlewareConsumer) {
    if (NODE_ENV === 'devlocal') {
      consumer.apply(MorganLoggerMiddleware).forRoutes('/');
    }
  }
}
