import { OrderEntity } from "src/modules/order/entity/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'type_order'})
export class TypeOrderEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar',length:255,unique:true})
    type:string;

    @OneToMany(()=>OrderEntity,(order)=>order.typeOrder)
    order:OrderEntity[];
}