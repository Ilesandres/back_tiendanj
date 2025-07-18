import { IsOptional } from "class-validator";
import { CategoryEntity } from "src/modules/category/entity/category.entity";
import { TypeMeasureEntity } from "src/modules/typemeasuremedida/entity/typemeasure.entity";


export class ProductsFiltersDto{
    @IsOptional()
    category:CategoryEntity;
    @IsOptional()
    name:string;
    @IsOptional()
    variationActive:boolean | null | string;
    @IsOptional()
    active:boolean | null | string;
    @IsOptional()
    minPrice:number;
    @IsOptional()
    maxPrice:number;
    @IsOptional()
    spice:TypeMeasureEntity;
    @IsOptional()
    measure:TypeMeasureEntity;

}