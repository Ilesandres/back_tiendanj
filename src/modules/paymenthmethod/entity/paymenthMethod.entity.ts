import { PaymentEntity } from "src/modules/payment/entity/payment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("paymenthmethod")
export class PaymenthMethodEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:100,unique:true})
    method:string;
    @OneToMany(()=>PaymentEntity,(payment)=>payment.method)
    payment:PaymentEntity[];
}