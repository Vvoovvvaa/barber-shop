export class CreateAuthDto {}
import { IsEnum, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { status } from "@app/common-barber/database/enums";

export class BarberOrClientDTO {

    @IsNotEmpty()
    @IsPhoneNumber()
    phone : string

    // @IsEnum({enum:status})
    // @IsNotEmpty()
    // statusUser : status
}