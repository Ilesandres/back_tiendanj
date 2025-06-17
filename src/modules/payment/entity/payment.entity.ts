import { OrderEntity } from "src/modules/order/entity/order.entity";
import { PaymenthMethodEntity } from "src/modules/paymenthmethod/entity/paymenthMethod.entity";
import { PaymentStatusEntity } from "src/modules/paymentstatus/entity/paymentstatus.entity";
import { VouchersEntity } from "src/modules/vouchers-abonos/entity/vouchers.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment")
export class PaymentEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>PaymenthMethodEntity,(method)=>method.payment)
    method:PaymenthMethodEntity;

    @ManyToOne(()=>PaymentStatusEntity,(status)=>status.payment)
    status:PaymentStatusEntity;

    @Column({type:"datetime",default:()=>"CURRENT_TIMESTAMP"})
    createdAt:Date;

    @OneToOne(()=>OrderEntity,(order)=>order.payment)
    order:OrderEntity;

    @OneToMany(()=>VouchersEntity,(vouchers)=>vouchers.payment)
    vouchers:VouchersEntity[];
}