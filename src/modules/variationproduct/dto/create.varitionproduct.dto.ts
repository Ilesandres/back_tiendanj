import { IsNotEmpty } from "class-validator";
import { ProductEntity } from "src/modules/product/entity/product.entity";
import { TypeMeasureEntity } from "src/modules/typemeasuremedida/entity/typemeasure.entity";

export class CreateVariationProductDto{
    @IsNotEmpty({message:"el sabor es requerido"})
    spice:string;
    @IsNotEmpty({message:"el precio es requerido"})
    price:number;
    @IsNotEmpty({message:"el stock es requerido"})
    stock:number;
    @IsNotEmpty({message:"el producto es requerido"})
    product:ProductEntity;
    @IsNotEmpty({message:"la medida es requerida"})
    measure:TypeMeasureEntity;
}