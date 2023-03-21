import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { Constants } from 'src/common/constants';

import EnvironmentVariables from 'src/common/interfaces/environmentVariables';

dotenv.config();

const { CRYPTO_ENCRYPTION_ALGORITHM, CRYPTO_DIGEST_METHOD, BCRYPT_SALT_ROUND } =
  process.env as EnvironmentVariables;

export const hashData = (data: string) => {
  const hash = crypto
    .createHash(CRYPTO_ENCRYPTION_ALGORITHM)
    .update(data)
    .digest(CRYPTO_DIGEST_METHOD);
  return bcrypt.hash(hash, Number(BCRYPT_SALT_ROUND));
};

export const compareHashed = (data: string, hashedData: string) => {
  const hash = crypto
    .createHash(CRYPTO_ENCRYPTION_ALGORITHM)
    .update(data)
    .digest(CRYPTO_DIGEST_METHOD);

  return bcrypt.compare(hash, hashedData);
};

export const checkIfAdmin = (roles: string[]): boolean => {
  const { Roles } = Constants;
  return roles.some((role) => {
    if (Roles.ADMIN_USERS.includes(role)) return true;

    return false;
  });
};
