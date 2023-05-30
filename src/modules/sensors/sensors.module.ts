import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { RedisCacheModule } from '../cache/cache.module';
import { ModelsModule } from 'src/database';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    RedisCacheModule,
    ModelsModule,
    QueueModule,
  ],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class SensorsModule { }
