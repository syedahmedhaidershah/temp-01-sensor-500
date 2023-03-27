import { BooleanString } from '../enums';

export default interface EnvironmentVariables {
  readonly NODE_ENV?: string;
  readonly ENABLE_ALL_ORIGINS?: BooleanString | string;
  readonly PORT?: number;
  readonly MYSQL_ENABLED?: BooleanString | string;
  readonly MYSQL_HOST?: string;
  readonly MYSQL_PORT?: number;
  readonly MYSQL_USERNAME?: string;
  readonly MYSQL_DATABASE?: string;
  readonly MYSQL_PASSWORD?: string;
  readonly MONGO_URL?: string;
  readonly CRYPTO_ENCRYPTION_ALGORITHM?: string;
  readonly CRYPTO_DIGEST_METHOD?: 'base64' | 'base64url' | 'hex' | 'binary';
  readonly BCRYPT_SALT_ROUND?: number;
  readonly JWT_SECRET_ACCESS_TOKEN_KEY?: string;
  readonly JWT_SECRET_REFRESH_TOKEN_KEY?: string;
  readonly MQTT_HOST?: string;
}
