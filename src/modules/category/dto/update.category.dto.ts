import { IsNotEmpty, IsOptional } from "class-validator";

export class updateCategoryDto{
    @IsOptional()
    category:string;
}