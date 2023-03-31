import { CacheService } from './cache.service';
import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';

dotenv.config();

const { CACHE_HOST, CACHE_ISGLOBAL, CACHE_PORT } =
  process.env as EnvironmentVariables;
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: CACHE_HOST,
      port: Number(CACHE_PORT),
      isGlobal: Boolean(CACHE_ISGLOBAL),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisCacheModule {}
