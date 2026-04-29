import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MIN } from "class-validator"

export class CretaeReviewDto{
    @IsMongoId()
    @IsNotEmpty()
    appointmentId:string

    @IsNumber()
    @Min(1)
    @Max(5)
    rating:number

    @IsOptional()
    @IsString()
    comment?:string

}