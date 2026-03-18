import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({timestamps:true})
export class BarberService {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  barber: Types.ObjectId; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number;
}

export const BarberServiceSchema =
  SchemaFactory.createForClass(BarberService);