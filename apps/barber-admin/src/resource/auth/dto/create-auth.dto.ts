import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(10)
    login:string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one number and one special character',
    },)
    password:string
}
