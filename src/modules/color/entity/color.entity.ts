import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("color")
export class ColorEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"varchar",length:255})
    color:string;

    @OneToMany(()=>VariationProductEntity,(variation)=>variation.color)
    variationProduct:VariationProductEntity[];
}