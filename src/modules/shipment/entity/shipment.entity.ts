import { OrderEntity } from "src/modules/order/entity/order.entity";
import { StatusShipmentEntity } from "src/modules/statusshipment/entity/statusshipment.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("shipment")
export class ShipmentEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @OneToOne(()=>OrderEntity,(order)=>order.shipment)
    @JoinColumn()
    order:OrderEntity;
    @ManyToOne(()=>StatusShipmentEntity,(status)=>status.shipment)
    status:StatusShipmentEntity;
    @Column({type:"text"})
    details:string;
}