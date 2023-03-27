import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({
    required: { required: true },
  })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  last_name?: string;

  @Prop({ default: '' })
  first_name?: string;

  @Prop({ required: true })
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
UserSchema.index({ username: 1 }, { name: 'IDX-User-username', unique: true });

UserSchema.index({ email: 1 }, { name: 'IDX-User-email', unique: true });

UserSchema.index(
  { phone_number: 1 },
  { name: 'IDX-User-phone_number', unique: true },
);
