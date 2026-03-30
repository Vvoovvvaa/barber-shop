import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { status } from "../enums";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  name: string;

  @Prop({type:String, enum: Object.values(status), required: true ,default:status.CLIENT})
  role: status;

  @Prop({default: true})
  isActivate: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);