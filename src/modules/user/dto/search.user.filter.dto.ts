import { IsOptional } from "class-validator";

export class SearchUserFilterDto{
    @IsOptional()
    name:string;
    @IsOptional()
    lastname:string;
    @IsOptional()
    email:string;
    @IsOptional()
    dni:string;
    @IsOptional()
    user:string;
}