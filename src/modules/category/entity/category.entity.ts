import { ProductEntity } from "src/modules/product/entity/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("category")
export class CategoryEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"varchar",length:100,unique:true})
    category:string;

    @Column({type:"boolean",default:true})
    active:boolean;

    @OneToMany(()=>ProductEntity,(product)=>product.category)
    product:ProductEntity[];
}