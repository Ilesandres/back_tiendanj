import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";

export class GenerateTokenDto{
    @IsNumber()
    id:number;
    @IsString()
    user:string;
    @IsString()
    rol:string;
    @IsBoolean()
    verify:boolean;
}