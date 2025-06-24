import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("typemeasure")
export class TypeMeasureEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:100,unique:true})
    measure:string;

    @OneToMany(()=>VariationProductEntity,(variation)=>variation.measure)
    VariationProduct:VariationProductEntity;
}