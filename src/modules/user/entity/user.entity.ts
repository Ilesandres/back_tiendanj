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

    @Column({type:"varchar",length:30,unique:true, nullable:true})
    user:string | null;

    @Column({type:"varchar",nullable:true})
    password:string | null;

    @Column({type:"varchar",length:10,unique:true, nullable:true})
    verificationCode:string | null;

    @Column({type:"varchar",unique:true, nullable:true})
    token:string | null;

    @Column({type:"datetime",nullable:true})
    datesendverify:Date | null;

    @ManyToOne(()=>RolEntity,(rol)=>rol.user)
    rol:RolEntity;

    @Column({type:"boolean",default:false})
    verify:boolean;
    @OneToMany(()=>OrderEntity,(order)=>order.user)
    order:OrderEntity[];
}