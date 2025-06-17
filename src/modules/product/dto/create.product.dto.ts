import { IsNotEmpty } from "class-validator";
import { CategoryEntity } from "src/modules/category/entity/category.entity";


export class CreateProductDto{
    @IsNotEmpty({message:"el producto es requerido"})
    product:string;

    @IsNotEmpty({message:"el stock es requerido"})
    stock:number;

    @IsNotEmpty({message:"la categoria es requerida"})
    category:CategoryEntity;
    
}