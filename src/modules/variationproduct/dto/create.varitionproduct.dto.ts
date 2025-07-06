import { IsNotEmpty, IsOptional } from "class-validator";
import { ColorEntity } from "src/modules/color/entity/color.entity";
import { ProductEntity } from "src/modules/product/entity/product.entity";
import { SpiceEntity } from "src/modules/spice/entity/spice.entity";
import { TypeMeasureEntity } from "src/modules/typemeasuremedida/entity/typemeasure.entity";

export class CreateVariationProductDto{
    @IsNotEmpty({message:"el sabor es requerido"})
    spice:SpiceEntity;
    @IsNotEmpty({message:"el precio es requerido"})
    price:number;
    @IsNotEmpty({message:"el stock es requerido"})
    stock:number;
    @IsNotEmpty({message:"el producto es requerido"})
    product:ProductEntity;
    @IsNotEmpty({message:"la medida es requerida"})
    measure:TypeMeasureEntity;
    @IsNotEmpty({message:"el color es requerido"})
    color:ColorEntity;
    @IsOptional()
    description:string;
    @IsOptional()
    image:string;
}