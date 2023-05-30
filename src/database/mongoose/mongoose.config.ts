import { ConnectOptions } from "mongoose";

export const MongooseConfig: ConnectOptions = {
    minPoolSize: 1,
    maxPoolSize: 200,
    autoIndex: true, //make this also true
}