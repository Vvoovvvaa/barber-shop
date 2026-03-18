import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateAppointmentDto {
  serviceId: string;
  startTime: Date;
}

