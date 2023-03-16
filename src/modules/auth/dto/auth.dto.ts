import { IsNotEmpty, IsString, isString } from 'class-validator';

export class AuthDto {
  // pseudoname for guest or chosen username
  @IsNotEmpty()
  @IsString()
  username: string;

  // password
  @IsNotEmpty()
  @IsString()
  password: string;
}
