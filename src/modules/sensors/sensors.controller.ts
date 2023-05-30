import { Controller, Post, Body } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import Bull from 'bull';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) { }

  @Post()
  async create(
    @Body() createSensorDto: CreateSensorDto
  ): Promise<Bull.Job> {
    return await this.sensorsService.processReading(createSensorDto);
  }
}
