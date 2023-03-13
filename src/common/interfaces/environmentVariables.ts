import { BooleanString, Environments } from '../enums';

export default interface EnvironmentVariables {
  NODE_ENV?: Environments | string;
  ENABLE_ALL_ORIGINS?: BooleanString | string;
  PORT?: number;
  MYSQL_ENABLED?: BooleanString | string;
  MYSQL_HOST?: string;
  MYSQL_PORT?: number;
  MYSQL_USERNAME?: string;
  MYSQL_DATABASE?: string;
  MYSQL_PASSWORD?: string;
}
