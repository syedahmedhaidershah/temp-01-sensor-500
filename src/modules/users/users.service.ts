import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
import { User } from './types';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      username: 'john',
      password: 'changeme',
    },
    {
      username: 'maria',
      password: 'changeme',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async insertOne(user: User): Promise<User | undefined> {
    this.users.push(user);
    return user;
  }
}
