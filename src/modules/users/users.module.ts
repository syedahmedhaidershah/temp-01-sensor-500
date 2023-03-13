/** Core dependencies */
import { Module } from '@nestjs/common';

/** Local dependencies */
import { UsersService } from '../../providers/users/users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
