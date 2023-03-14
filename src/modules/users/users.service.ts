import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
import { User } from '../../common/types';


@Injectable()
export class UsersService {

    async findOne(username: string): Promise<User | undefined> {
        /**
         * @todo integrate database service
         */
        return {
            _id: 'someid',
            username: 'sahs9996',
            deleted: false
        };
    }
}