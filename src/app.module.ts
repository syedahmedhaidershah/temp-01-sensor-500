/** Core dependencies */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/** Third party dependencies */
import * as dotenv from 'dotenv';

/** Local dependencies */
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { ChairModule } from './modules/chair/chair.module';
import { AppService } from './app.service';
import { MorganLoggerMiddleware } from './common/middlewares/morgan-logger/morgan-logger.middleware';
import { CheckExpiredToken } from './common/middlewares/check-expired-token';
import { ModelsModule } from './database/mongoose';
import { RouteInfo } from '@nestjs/common/interfaces';
import { JwtAuthGuardProvider } from './modules/auth/guards';
import { ResponseInterceptorProvider } from './common/interceptors';
import { RedisCacheModule } from './modules/cache/cache.module';
import { PaymentModule } from './modules/payment/payment.module';

/** Local constants and statics */
import EnvironmentVariables from './common/interfaces/environmentVariables';

/** Local configuration and declarations */
/** Setting up environment from env files if it exists, and environment isn't loaded */
dotenv.config();

/** Application configuration and declarations */
const { NODE_ENV, MONGO_URL } = process.env as EnvironmentVariables;

const toExclueRouteInfosFromcheckExpiredToken: RouteInfo[] = [
  { path: 'auth/(.*)', method: RequestMethod.ALL },
  { path: '(.*)/health-check', method: RequestMethod.GET },
];

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(MONGO_URL),
    ModelsModule,
    ChairModule,
    RedisCacheModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuardProvider, ResponseInterceptorProvider],
})
export class AppModule implements NestModule {
  /** Configuring middlewares */
  configure(consumer: MiddlewareConsumer) {
    /** Enabling logger for local development */
    if (NODE_ENV === 'devlocal') {
      consumer.apply(MorganLoggerMiddleware).forRoutes('/');
    }

    /** Disabling Check Expired Token middleware */
    consumer
      .apply(CheckExpiredToken)
      .exclude(...toExclueRouteInfosFromcheckExpiredToken)
      .forRoutes('*');
  }
}
