// This should be a real class/interface representing a user entity
export type UserType = {
  _id?: string;
  username: string;

  password: string;

  email?: string;

  last_name?: string;

  first_name?: string;

  hashed_rt?: string;

  deleted?: boolean;

  roles?: string[];

  deleted_at?: Date;
};
