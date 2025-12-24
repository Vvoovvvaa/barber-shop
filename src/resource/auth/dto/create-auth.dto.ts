export class CreateAuthDto {}
import { IsEnum, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { status } from "src/database/enums";

export class BarberOrClientDTO {

    @IsNotEmpty()
    @IsPhoneNumber()
    phone : string

    @IsEnum({enum:status})
    @IsNotEmpty()
    statusUser : status
}