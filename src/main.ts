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
  let { ENABLE_ALL_ORIGINS = 'false' } = process.env as EnvironmentVariables;

  const { PORT, API_BASE } = process.env as EnvironmentVariables;
  ENABLE_ALL_ORIGINS = JSON.parse(ENABLE_ALL_ORIGINS as string);

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

  if (ENABLE_ALL_ORIGINS) return await app.listen(PORT, '0.0.0.0');

  return await app.listen(PORT);
}

bootstrap();
