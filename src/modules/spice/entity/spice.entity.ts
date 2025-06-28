import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("spice")
export class SpiceEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"varchar",length:255})
    spice:string;

    @OneToMany(()=>VariationProductEntity,(variation)=>variation.spice)
    varitionProduct:VariationProductEntity[];
}