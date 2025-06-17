import { OrderEntity } from "src/modules/order/entity/order.entity";
import { VariationProductEntity } from "src/modules/variationproduct/entity/variationproduct.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("productorder")
export class ProductOrderEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>OrderEntity,(order)=>order.productOrder)
    order:OrderEntity;

    @ManyToOne(()=>VariationProductEntity,(product)=>product.productOrder)
    product:VariationProductEntity;

    @Column({type:"int",default:0})
    amount:number;
}