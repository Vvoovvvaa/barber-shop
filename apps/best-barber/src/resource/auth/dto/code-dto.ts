import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class VerifyCodeDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsOptional()
    email?:string

    @IsOptional()
    phone?: string
}