import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class AdminUser extends User {}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
