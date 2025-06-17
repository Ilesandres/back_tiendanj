import { CategoryEntity } from "src/modules/category/entity/category.entity";
import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class ProductEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:100, unique:true})
    product:string;

    @ManyToOne(()=>CategoryEntity,(category)=>category.product)
    category:CategoryEntity;
    @OneToMany(()=>VariationProductEntity,(variation)=>variation.product)
    variation:VariationProductEntity;
    
}