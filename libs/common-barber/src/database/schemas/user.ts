import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { status } from "../enums";

@Schema({ timestamps: true })
export class User {

  @Prop({ unique: true, sparse: true })
  phone?: string;

  @Prop()
  name: string;

  @Prop({
    type: String,
    enum: Object.values(status),
    required: true,
    default: status.CLIENT
  })
  role: status;

  @Prop({ default: true })
  isActivate: boolean;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  googleId?: string;

  // @Prop({ default: 0 })
  // retingAvd: number

  // @Prop({ default: 0 })
  // retingCount: number
}

export const UserSchema = SchemaFactory.createForClass(User);