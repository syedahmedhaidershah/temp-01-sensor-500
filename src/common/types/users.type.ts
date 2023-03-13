// This should be a real class/interface representing a user entity
export type User = {
    // Mongo Object Id
    _id: string;

    // pseudoname for guest or chosen username
    username: string;

    deleted: boolean;

    isInactive?: boolean;

    // email for user
    email?: string;

    // password if set up
    password?: string;
};