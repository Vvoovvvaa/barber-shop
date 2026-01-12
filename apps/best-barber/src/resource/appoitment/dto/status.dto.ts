import { IsEnum, IsNotEmpty } from "class-validator";
import { AppointmentStatus } from "@app/common-barber/database/enums";

export class AppointmentStatusDTO {
    @IsNotEmpty()
    @IsEnum({enum:AppointmentStatus})
    status:AppointmentStatus
}