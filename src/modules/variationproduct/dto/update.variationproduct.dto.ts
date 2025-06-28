import { IsNotEmpty, IsOptional } from "class-validator";
import { ColorEntity } from "src/modules/color/entity/color.entity";
import { ProductEntity } from "src/modules/product/entity/product.entity";
import { SpiceEntity } from "src/modules/spice/entity/spice.entity";
import { TypeMeasureEntity } from "src/modules/typemeasuremedida/entity/typemeasure.entity";

export class UpdateVariationProductDto{
    @IsOptional()
    spice:SpiceEntity;
    @IsOptional()
    price:number;
    @IsOptional()
    stock:number;
    @IsOptional()
    product:ProductEntity;
    @IsOptional()
    measure:TypeMeasureEntity;
    @IsOptional()
    color:ColorEntity;
    @IsOptional()
    image:string;
}