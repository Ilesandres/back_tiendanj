import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("paymentstatus")
export class PaymentStatusEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:100,unique:true})
    status:string;

    @OneToMany(()=>PaymentEntity,(payment)=>payment.status)
    payment:PaymentEntity[];
}