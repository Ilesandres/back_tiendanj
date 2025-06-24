import { ColorEntity } from "src/modules/color/entity/color.entity";
import { ProductEntity } from "src/modules/product/entity/product.entity";
import { ProductOrderEntity } from "src/modules/productorder/entity/productorder.entity";
import { SpiceEntity } from "src/modules/spice/entity/spice.entity";
import { TypeMeasureEntity } from "src/modules/typemeasuremedida/entity/typemeasure.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("variationproduct")
export class VariationProductEntity{
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column({type:"float",default:0})
    price:number;
    @Column({type:"int",default:0})
    stock:number;
    @Column({type:"boolean",default:true})
    active:boolean;
    

    @Column({type:"varchar",length:255})
    image:string;

    @ManyToOne(()=>ProductEntity,(product)=>product.variation)
    product:ProductEntity;
    @ManyToOne(()=>TypeMeasureEntity,(measure)=>measure.VariationProduct)
    measure:TypeMeasureEntity;

    @OneToMany(()=>ProductOrderEntity,(productOrder)=>productOrder.product)
    productOrder:ProductOrderEntity[];

    @ManyToOne(()=>ColorEntity,(color)=>color.variationProduct)
    color:ColorEntity;
    
    @ManyToOne(()=>SpiceEntity,(spice)=>spice.varitionProduct)
    spice:SpiceEntity;
}