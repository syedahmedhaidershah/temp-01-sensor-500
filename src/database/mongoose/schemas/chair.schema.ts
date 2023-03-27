import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChairStates } from 'src/common/enums';

@Schema({
  timestamps: true,
})
export class Chair {
  @Prop({ required: true})
  id: string;

  @Prop( { required: true,default:0 })
  battery: number;

  @Prop({ required: true,default:ChairStates.Offline })
  state: ChairStates;

  @Prop({ required: true })
  qr_code?: string;

}


export const ChairSchema = SchemaFactory.createForClass(Chair);

ChairSchema.index(
  {id:1},
  {unique:true,name:'IDX-Chair_id'}
)
ChairSchema.index(
  {qr_code:1},
  {unique:true,name:'IDX-Chair_qr_code'}
)