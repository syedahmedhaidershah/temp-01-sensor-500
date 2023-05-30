import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
})
export class Test { }

export const TestSchema = SchemaFactory.createForClass(Test);