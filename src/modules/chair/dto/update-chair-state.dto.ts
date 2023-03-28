import { IsEnum } from 'class-validator';
import { ChairStates } from 'src/common/enums';

export class UpdateChairStateDto {
  @IsEnum(ChairStates)
  state: ChairStates;
  
  [key: string]: any;
}
