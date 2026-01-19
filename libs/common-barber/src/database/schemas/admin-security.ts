// admin-security.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Admin } from "./admin";

// export type AdminSecurityDocument = AdminSecurity & Document;

@Schema({ timestamps: true })
export class AdminSecurity {
  @Prop({ type: Types.ObjectId, ref: Admin.name, required: true })
  admin: Types.ObjectId;

  @Prop({ default: null })
  temporaryBlockUntil?: Date;

  @Prop({ default: false })
  permanentlyBlock: boolean;

  @Prop({ default: 0 })
  totalLoginAttempts: number;

  @Prop({ default: 0 })
  temporaryBlocksCount: number;
}

export const AdminSecuritySchema = SchemaFactory.createForClass(AdminSecurity);
