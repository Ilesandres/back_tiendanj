import { ProductEntity } from "src/modules/product/entity/product.entity";
import { ProductOrderEntity } from "src/modules/productorder/entity/productorder.entity";
import { TypeMeasureEntity } from "src/modules/typemeasure-medida/entity/typemeasure.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("variationproduct")
export class VariationProductEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"varchar",length:100,unique:true})
    spice:string;
    @Column({type:"float",default:0})
    price:number;
    @Column({type:"int",default:0})
    stock:number;

    @ManyToOne(()=>ProductEntity,(product)=>product.variation)
    product:ProductEntity;
    @ManyToOne(()=>TypeMeasureEntity,(measure)=>measure.VariationProduct)
    measure:TypeMeasureEntity;

    @OneToMany(()=>ProductOrderEntity,(productOrder)=>productOrder.product)
    productOrder:ProductOrderEntity[];
}