import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./user";

@Schema({ timestamps: true})
export class userSecurity {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ default: null })
  temporaryBlockUntil?: Date;

  @Prop({ default: false })
  permanentlyBlock: boolean;

  @Prop({ default: 0 })
  totalLoginAttempts: number;

  @Prop({ default: 0 })
  temporaryBlocksCount: number;
}

export const userSecuritySchema = SchemaFactory.createForClass(userSecurity);
