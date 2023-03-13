/** Third part dependencies */
import { Column, Model, Table } from 'sequelize-typescript';


/** Local dependencies */
import { User as UserType } from '../../../common/types';


@Table
export class User extends Model {
    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column({ defaultValue: true })
    isActive: boolean;
}