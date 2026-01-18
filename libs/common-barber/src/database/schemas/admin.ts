import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema({timestamps:true})
export class Admin {
    @Prop({required:true,unique:true})
    login:string

    @Prop({required:true,select:false})
    password:string

    @Prop({default:false,select:false})
    superAdmin:boolean
}

export const AdminSchema = SchemaFactory.createForClass(Admin)



