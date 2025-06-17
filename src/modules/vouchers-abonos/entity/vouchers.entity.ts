import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("vouchers")
export class VouchersEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>PaymentEntity,(payment)=>payment.vouchers)
    payment:PaymentEntity;

    @Column({type:"float",precision:10,scale:2})
    value:number;

    @Column({type:"datetime",default:()=>"CURRENT_TIMESTAMP"})
    createdAt:Date;

    @Column({type:"datetime",default:()=>"CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"})
    updatedAt:Date;
}