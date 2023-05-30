/** Core dependencies */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/** Third party dependencies */
import * as dotenv from 'dotenv';
import { BullModule } from '@nestjs/bull';

/** Local dependencies */
import { AppController } from './app.controller';
import { MorganLoggerMiddleware } from './common/middlewares/morgan-logger/morgan-logger.middleware';
import { ModelsModule, MongooseConfig } from './database/mongoose';
import { ResponseInterceptorProvider } from './common/interceptors';
import { RedisCacheModule } from './modules/cache/cache.module';
import { SensorsModule } from './modules/sensors/sensors.module';


/** Local constants and statics */
import EnvironmentVariables from './common/interfaces/environmentVariables';
import { bullQueueConfig } from './config';

/** Local configuration and declarations */
/**
 * @note Setting up environment from env files if it exists, and environment isn't loaded
 * Usually this isn't the case, but swagger initialization sometimes lead to do so
 */
dotenv.config();

/** Application configuration and declarations */
const {
  NODE_ENV,
  MONGO_URL
} = process.env as EnvironmentVariables;


@Module({
  imports: [
    MongooseModule
      .forRoot(
        MONGO_URL,
        MongooseConfig,
      ),
    ModelsModule,
    RedisCacheModule,
    BullModule.forRoot(
      bullQueueConfig
    ),
    SensorsModule,
  ],
  controllers: [AppController],
  providers: [
    ResponseInterceptorProvider
  ],
})
export class AppModule implements NestModule {
  /** Configuring middlewares */
  configure(consumer: MiddlewareConsumer): void {

    /** Enabling logger for local development */
    if (NODE_ENV === 'devlocal') {
      consumer
        .apply(MorganLoggerMiddleware)
        .forRoutes('/');
    }
  }
}
