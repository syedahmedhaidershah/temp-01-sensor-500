import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({
    required: { required: true },
  })
  password: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ default: '' })
  last_name?: string;

  @Prop({ default: '' })
  first_name?: string;

  @Prop({ required: { required: true } })
  phone_number?: string;

  @Prop({ default: false })
  deleted?: boolean;

  @Prop([String])
  roles?: string[];

  @Prop()
  hashed_rt?: string;

  @Prop()
  deleted_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
