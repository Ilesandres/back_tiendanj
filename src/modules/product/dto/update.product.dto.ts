import { IsNotEmpty, IsOptional } from "class-validator";
import { CategoryEntity } from "src/modules/category/entity/category.entity";


export class UpdateProductDto{
    @IsOptional()
    product:string;


    @IsOptional()
    category:CategoryEntity;
    
}