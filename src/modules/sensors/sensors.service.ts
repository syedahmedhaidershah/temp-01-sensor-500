import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { CacheService } from '../cache/cache.service';
import { Constants } from 'src/common/constants';
import { businessParameters } from 'src/config';
import { QueueService } from '../queue/queue.service';
import Bull from 'bull';

@Injectable()
export class SensorsService {
  constructor(
    private readonly cache: CacheService,
    private readonly queue: QueueService,
  ) { }

  async processReading(
    createSensorDto: CreateSensorDto
  ): Promise<Bull.Job> {

    const {
      uniqueId,
      someSensorReading,
    } = createSensorDto;

    const requestKey = `${uniqueId}-${someSensorReading}`;


    const requestAlreadyPersisted = await this.cache.get(requestKey);

    if (requestAlreadyPersisted)
      throw new ConflictException(Constants.ErrorMessages.READING_REPITETION);


    const requestPersisted = await this.cache.set(
      requestKey,
      someSensorReading,
      businessParameters.sensors.acceptableRequestTimeRange,
    );

    const addedJob = await this.queue.addJob({
      topic: 'new-job',
      message: {
        uniqueId,
        someSensorReading
      }
    })

    return addedJob;
  }
}
