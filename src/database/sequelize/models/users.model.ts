/** Third part dependencies */
import { Column, Model, Table } from 'sequelize-typescript';


/** Local dependencies */
import { User as UserType } from '../../../common/types';


@Table
export class User extends Model {

    // pseudoname for guest or chosen username
    username: string;

    firstName?: string;

    lastName?: string;

    deleted: boolean;

    isInactive?: boolean;

    // email for user
    email?: string;

    // password if set up
    password?: string;
    
    instance: UserType | undefined;


    constructor() {
        super();

        this.instance = this.toJSON() as UserType;
    }
}