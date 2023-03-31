import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  _id: string;

  @ValidateIf((dto) => !dto.is_guest)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ValidateIf((dto) => !dto.is_guest)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ValidateIf((dto) => !dto.is_guest)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  is_guest?: boolean;

  @IsBoolean()
  is_verified?: boolean;

  @IsOptional()
  last_name?: string;

  @IsOptional()
  first_name?: string;

  @IsOptional()
  deleted: boolean;

  @ValidateIf((dto) => !dto.isGuest)
  @IsArray()
  roles: string[];

  @IsOptional()
  deleted_at: Date;
}
