import { Module } from '@nestjs/common';
import { ModelsModule } from 'src/database/mongoose';
import { UsersService } from './users.service';

@Module({
  imports: [ModelsModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
