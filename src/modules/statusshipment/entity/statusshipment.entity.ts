import { ShipmentEntity } from "src/modules/shipment/entity/shipment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("statusshipment")
export class StatusShipmentEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:100,unique:true})
    status:string;

    @OneToMany(()=>ShipmentEntity,(shipment)=>shipment.status)
    shipment:ShipmentEntity[];
}