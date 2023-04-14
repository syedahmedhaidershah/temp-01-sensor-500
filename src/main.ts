/** Core dependencies */
import { NestFactory } from '@nestjs/core';

/** Local dependenices */
import { AppModule } from './app.module';

import EnvironmentVariables from './common/interfaces/environmentVariables';

import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  dotenv.config();
  /** Setting up environment from env files if it exists */

  /** Configurations and declarations */

  const { PORT, API_BASE, ENABLE_ALL_ORIGINS = 'true' } = process.env as EnvironmentVariables;
  const ENABLE_ALL_ORIGINS_BOOL = JSON.parse(ENABLE_ALL_ORIGINS as string);

  /** Configuring runtime and bootstrapping */
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    //* User for fastify integration
    // new FastifyAdapter(),
    // {
    //   logger: ['error', 'debug', 'verbose'],
    // },
  );
  app.setGlobalPrefix(API_BASE);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  if (ENABLE_ALL_ORIGINS_BOOL) {
    app.enableCors();
  }

  return await app.listen(PORT);
}

bootstrap();
