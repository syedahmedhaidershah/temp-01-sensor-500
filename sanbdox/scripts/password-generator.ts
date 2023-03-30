import * as dotenv from 'dotenv';



import * as JWT from 'jsonwebtoken';



dotenv.config();



const {
    argv: [password] = [],
    env: {
        JWT_SECRET_ACCESS_TOKEN_KEY: JWT_SECRET_KEY
    }
} = process;

if (!JWT_SECRET_KEY)
    throw new Error('no password JWT_SECRET_KEY: '.concat(JWT_SECRET_KEY));


if (!password)
    throw new Error('no password provided');

JWT
    .sign(password, JWT_SECRET_KEY, console.log)