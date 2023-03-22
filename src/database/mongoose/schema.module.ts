import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema, User, UserSchema } from './schemas';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from './schemas/expired-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
      // add more models here
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },

      // export models here
    ]),
  ],
})
export class ModelsModule {}