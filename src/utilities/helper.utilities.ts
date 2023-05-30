import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { Constants } from 'src/common/constants';

dotenv.config();


export const checkIfAdmin = (roles: string[]): boolean => {
  const { Roles } = Constants;
  return roles.some((role) => {
    if (Roles.ADMIN_USERS.includes(role)) return true;

    return false;
  });
};

export const randomNumberGenerator = (length: number): number => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  );
};

export const generateUUID = (): string => {
  return uuidv4();
};


export const capitalize = (stringToCapitalize: string): string => {
  const [firstCharacter, ...restOfTheCharacters] = stringToCapitalize.split('');

  return [
    firstCharacter
      .toUpperCase(),
    ...restOfTheCharacters
  ]
    .join('');
}
