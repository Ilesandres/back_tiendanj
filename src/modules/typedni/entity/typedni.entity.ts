import { PeopleEntity } from "src/modules/people/entity/people.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("typedni")
export class TypeDniEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:"varchar",length:10,unique:true})
    name:string;

    @OneToMany(()=>PeopleEntity,(people)=>people.typeDni)
    people:PeopleEntity[];
}