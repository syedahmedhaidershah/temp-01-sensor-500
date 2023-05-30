import { CreateSensorDto } from "src/modules/sensors/dto/create-sensor.dto"

export type QueueData = {
    topic: string,
    message: CreateSensorDto
}