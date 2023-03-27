import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
  } from 'class-validator';
  import { ChairStates } from 'src/common/enums';
  
  export class ChairDto {

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    @IsNotEmpty()
    battery: number;

    @IsEnum(ChairStates)
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    qr_code: string;
  
  }
  