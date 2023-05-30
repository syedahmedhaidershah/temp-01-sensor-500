import { IsNumber, IsString } from "class-validator";

export class CreateSensorDto {
    @IsString()
    uniqueId: string;

    @IsNumber()
    someSensorReading: number;
}
