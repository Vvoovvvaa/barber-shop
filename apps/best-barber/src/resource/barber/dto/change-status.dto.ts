import { IsPhoneNumber } from "class-validator";

export class changeStatusDto {
    @IsPhoneNumber()
    phone: string
}