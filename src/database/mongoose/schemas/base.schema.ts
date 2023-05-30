import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** Defining a schema class */
@Schema({
    timestamps: true,
})
export class Base {
    @Prop({ default: false })
    isDeleted: boolean;
}

/**
 * Generating a Mongoose Schema
 */
export const BaseSchema = SchemaFactory
    .createForClass(Base);
