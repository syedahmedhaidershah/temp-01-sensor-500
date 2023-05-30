import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Document, Model } from 'mongoose';
import { Sensor } from 'src/database/mongoose/schemas';
import { CreateSensorDto } from 'src/modules/sensors/dto/create-sensor.dto';
import { QueueData } from '../types';
import { queueConfig } from '../queue.config';

// @Injectable()
@Processor('sensor-data-queue')
export class SensorConsumer {
    constructor(
        @InjectModel(Sensor.name) private readonly sensorData: Model<CreateSensorDto>,
    ) { }

    @Process(queueConfig.name)
    async processSensorData(
        job: Job<unknown> & { data: QueueData }
    ): Promise<
        Partial<Document> & CreateSensorDto
    > {
        const {
            data: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                topic,
                message: {
                    uniqueId,
                    someSensorReading,
                },
                message,
            }
        } = job;

        try {
            const newSensor = new this.sensorData({ uniqueId, someSensorReading });

            const saved = await newSensor.save();

            return saved;
        } catch (exc) {
            console.log(exc);

            return message;
        }
    }
}
