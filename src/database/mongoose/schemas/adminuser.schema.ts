import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class AdminUser extends User {}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);

AdminUserSchema.index(
  { username: 1 },
  { name: 'IDX-AdminUser-username', unique: true },
);

AdminUserSchema.index(
  { email: 1 },
  { name: 'IDX-AdminUser-email', unique: true },
);

AdminUserSchema.index(
  { phone_number: 1 },
  { name: 'IDX-AdminUser-phone_number', unique: true },
);
