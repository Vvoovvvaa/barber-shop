import { endOrder } from "@app/common-barber";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EndOrderDTO {
    @IsNotEmpty()
    @IsString()
    appointmentId!: string

    @IsNotEmpty()
    @IsEnum(endOrder)
    result!: endOrder

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    priceOfWork!: number;
}