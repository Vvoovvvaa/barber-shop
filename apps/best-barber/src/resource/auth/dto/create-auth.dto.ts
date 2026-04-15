export class CreateAuthDto {}
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { status } from "@app/common-barber/database/enums";

export class BarberOrClientDTO {

    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string

    @IsOptional()
    @IsEmail()
    email?: string

    // @IsEnum({enum:status})
    // @IsNotEmpty()
    // statusUser : status
}