import { TypeDniEntity } from "src/modules/typedni/entity/typedni.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("people")
export class PeopleEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"varchar",length:10,unique:true})
    name:string;
    @Column({type:"varchar",length:10,unique:true})
    lastname:string;
    @Column({type:"varchar",length:10,unique:true})
    phone:string;
    @Column({type:'date',nullable:true })
    birthdate:string;
    @Column({type:"varchar",length:100,unique:true, nullable:true})
    email:string
    @ManyToOne(()=>TypeDniEntity,(TypeDniEntity)=>TypeDniEntity.people)
    typeDni:TypeDniEntity;
    @Column({type:"varchar",length:10,unique:true})
    dni:string;
    @OneToOne(()=>UserEntity,(UserEntity)=>UserEntity.people)
    user:UserEntity;
}