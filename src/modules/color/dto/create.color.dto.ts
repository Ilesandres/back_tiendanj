import { IsNotEmpty, IsString } from "class-validator";
import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class CreateColorDto{
    @IsNotEmpty({message:"el color es requerido"})
    @IsString({message:"el color debe ser un string"})
    color:string;

}