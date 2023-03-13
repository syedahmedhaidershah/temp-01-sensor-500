/** Core dependencies */
import { NestFactory } from '@nestjs/core';

/** Local dependenices */
import { AppModule } from './app.module';

import EnvironmentVariables from './common/interfaces/environmentVariables';

/** Third party dependencies and libraries */
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import * as dotenv from 'dotenv';

async function bootstrap() {
  /** Setting up environment from env files if it exists */
  dotenv.config();


  /** Configurations and declarations */
  let {
    ENABLE_ALL_ORIGINS = 'false',
  } = process.env as EnvironmentVariables;

  const {
    PORT
  } = process.env as EnvironmentVariables;

  ENABLE_ALL_ORIGINS = JSON.parse(ENABLE_ALL_ORIGINS as string);


  /** Configuring runtime and bootstrapping */
  const app = await NestFactory
    .create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

  if (ENABLE_ALL_ORIGINS)
    return await app.listen(PORT, '0.0.0.0');

  return await app.listen(PORT);
}

bootstrap();
