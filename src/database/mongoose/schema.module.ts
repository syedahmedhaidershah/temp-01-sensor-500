import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema, User, UserSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      // add more models here
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },

      // export models here
    ]),
  ],
})
export class ModelsModule {}
