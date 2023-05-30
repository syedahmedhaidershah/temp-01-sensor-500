import { BullModuleOptions } from '@nestjs/bull';
import EnvironmentVariables from 'src/common/interfaces/environmentVariables';


/** Application configuration and declarations */
const {
    QUEUE_REDIS_HOST,
    QUEUE_REDIS_PORT,
    QUEUE_JOB_RATE_LIMITER_MAX,
    QUEUE_JOB_RATE_LIMITER_DURATION
} = process.env as EnvironmentVariables;


export const bullQueueConfig: BullModuleOptions = {
    redis: {
        host: QUEUE_REDIS_HOST,
        port: QUEUE_REDIS_PORT,
    },
    limiter: {
        max: QUEUE_JOB_RATE_LIMITER_MAX,
        duration: QUEUE_JOB_RATE_LIMITER_DURATION
    },
}