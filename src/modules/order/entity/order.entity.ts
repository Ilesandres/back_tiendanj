import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { ProductEntity } from "src/modules/product/entity/product.entity";
import { ProductOrderEntity } from "src/modules/productorder/entity/productorder.entity";
import { ShipmentEntity } from "src/modules/shipment/entity/shipment.entity";
import { TypeOrderEntity } from "src/modules/typeorder/entity/type.order.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("order")
export class OrderEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>UserEntity,(user)=>user.order)
    user:UserEntity;
    @OneToOne(()=>PaymentEntity,(payment)=>payment.order)
    @JoinColumn()
    payment:PaymentEntity;
    @Column({type:"datetime",default:()=>"CURRENT_TIMESTAMP"})
    createdAt:Date;
    @Column({type:"text", nullable:true})
    invoice:string;
    @Column({type:"varchar",length:255,nullable:true})
    total:string;

    @OneToMany(()=>ProductOrderEntity,(productOrder)=>productOrder.order)
    productOrder:ProductOrderEntity[];
    @OneToOne(()=>ShipmentEntity,(shipment)=>shipment.order)
    shipment:ShipmentEntity;

    @ManyToOne(()=>TypeOrderEntity,(typeOrder)=>typeOrder.order)
    typeOrder:TypeOrderEntity;
}