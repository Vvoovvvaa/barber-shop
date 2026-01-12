import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AppointmentStatus } from '../enums';

@Schema({ timestamps: true })
export class Appointment {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  barber: Types.ObjectId;

  @Prop({ required: true })
  services: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ type:String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.PENDING })
  status: AppointmentStatus;
}


export const AppointmentSchema =
  SchemaFactory.createForClass(Appointment);
 