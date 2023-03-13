/** Core dependencies */
import { Injectable } from '@nestjs/common';



/** Local dependencies */
import { User } from '../../common/types';



@Injectable()
export class UsersService {
  private readonly users = [];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
