import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema, Chair, ChairSchema, User, UserSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      {name:Chair.name,schema:ChairSchema}
      // add more models here
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AdminUser.name, schema: AdminUserSchema },
      {name:Chair.name,schema:ChairSchema}

      // export models here
    ]),
  ],
})
export class ModelsModule {}
