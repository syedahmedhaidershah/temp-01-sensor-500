import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { queueConfig } from './queue.config';
import { SensorConsumer } from './consumers/sensor.consumer';
import { ModelsModule } from 'src/database';

@Module({
    imports: [
        BullModule.registerQueue(queueConfig),
        ModelsModule,
    ],
    exports: [QueueService],
    providers: [
        QueueService,
        SensorConsumer
    ]
})
export class QueueModule { }
