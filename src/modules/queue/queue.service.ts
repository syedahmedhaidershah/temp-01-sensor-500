import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { queueConfig } from './queue.config';
import { QueueData, QueueJobOptions } from './types';

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(queueConfig.name) private readonly sensorDataQueue: Queue
    ) { }

    addJob = async (
        queueData: QueueData,
        options: QueueJobOptions = {}
    ): Promise<Bull.Job<any>> => {
        const {
            name = queueConfig.name,
            ...queueOptions
        } = options;

        const added = await this.sensorDataQueue.add(
            name,
            queueData,
            queueOptions,
        );

        return added;
    }
}
