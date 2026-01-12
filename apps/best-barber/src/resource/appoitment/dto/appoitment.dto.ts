import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateAppointmentDto {
    @IsNotEmpty()
    barberId: string;

    @IsNotEmpty()
    services: string;

    @IsDate()
    @Type(() => Date)
    startTime: Date;
}

