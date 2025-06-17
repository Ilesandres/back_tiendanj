import { OrderEntity } from "src/modules/order/entity/order.entity";
import { PeopleEntity } from "src/modules/people/entity/people.entity";
import { RolEntity } from "src/modules/rol/entity/rol.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @OneToOne(()=>PeopleEntity,(PeopleEntity)=>PeopleEntity.user)
    @JoinColumn()
    people:PeopleEntity;

    @Column({type:"varchar",length:30,unique:true})
    user:string;

    @Column({type:"varchar",nullable:true})
    password:string;

    @Column({type:"varchar",length:10,unique:true, nullable:true})
    verificationCode:string;

    @Column({type:"varchar",unique:true, nullable:true})
    token:string;

    @Column({type:"datetime",nullable:true})
    datesendverify:Date;

    @ManyToOne(()=>RolEntity,(rol)=>rol.user)
    rol:RolEntity;

    @Column({type:"boolean",default:false})
    verify:boolean;
    @OneToMany(()=>OrderEntity,(order)=>order.user)
    order:OrderEntity[];
}