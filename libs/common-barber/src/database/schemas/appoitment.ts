import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AppointmentStatus, endOrder } from '../enums';
import { BarberService } from './barber-service';

@Schema({ timestamps: true })
export class Appointment {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: BarberService.name, required: true })
  barber: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'BarberService', required: true })
  service: Types.ObjectId; 

  @Prop({ required: true })
  startTime: Date;

  @Prop({
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.PENDING
  })
  status: AppointmentStatus;

  @Prop({type:String,enum: endOrder,default:null})
  end: endOrder | null

}


export const AppointmentSchema =
  SchemaFactory.createForClass(Appointment);
 