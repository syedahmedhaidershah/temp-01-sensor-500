import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  _id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  first_name: string;

  @IsOptional()
  deleted: boolean;

  @IsArray()
  roles?: string[];

  @IsOptional()
  deleted_at: Date;
}
