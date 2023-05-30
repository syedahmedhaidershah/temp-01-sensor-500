import { BooleanString } from '../enums';

export default interface EnvironmentVariables {
  readonly NODE_ENV?: string;
  readonly ENABLE_ALL_ORIGINS?: BooleanString | string;
  readonly PORT?: number;
  readonly MONGO_URL?: string;
  readonly CACHE_HOST?: string;
  readonly CACHE_PORT?: number;
  readonly CACHE_ISGLOBAL?: BooleanString | string;
  readonly CACHE_TTL?: number;
  readonly API_BASE?: string;
  readonly QUEUE_REDIS_PORT?: number;
  readonly QUEUE_REDIS_HOST?: string;
  readonly QUEUE_JOB_RATE_LIMITER_MAX?: number;
  readonly QUEUE_JOB_RATE_LIMITER_DURATION?: number;
}
