import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("rol")
export class RolEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:10,unique:true})
    rol:string;

    @OneToMany(()=>UserEntity,(user)=>user.rol)
    user:UserEntity[];
}