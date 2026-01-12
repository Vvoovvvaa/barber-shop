import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { status } from '../enums';

export type AuthSessionDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true })
export class Auth {
    @Prop({ required: true })
    phone: string;

    @Prop({type:String, enum: Object.values(status), required: true,default:status.CLIENT })
    status: status;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true, default: new Date(Date.now() + 5 * 60 * 1000) })
    expiresAt: Date;

    @Prop({ default: false })
    verified: boolean;
}

export const AuthSessionSchema =
    SchemaFactory.createForClass(Auth);

