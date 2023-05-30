import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from './base.schema';

/** Defining a schema class */
@Schema({
    timestamps: true,
})
export class Sensor extends Base {
    @Prop({ required: true })
    uniqueId: string;

    // Other payload data
    @Prop({ required: true })
    someSensorReading: number;
}

/**
 * Generating a Mongoose Schema
 */
export const SensorSchema = SchemaFactory
    .createForClass(Sensor);


/** Generating indexes for Mongoose Class */
SensorSchema
    .index(
        { uniqueId: 1 }
    )