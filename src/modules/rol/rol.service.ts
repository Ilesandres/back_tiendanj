import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from './entity/rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolService {
    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository:Repository<RolEntity>
    ){}

    async findAll():Promise<RolEntity[]>{
        try {
            const roles=await this.rolRepository.find();
            if(roles.length===0){
                throw new NotFoundException({message:"no se encontraron roles"})
            }
            return roles;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<RolEntity>{
        try {
            const rol=await this.rolRepository.findOne({where:{id}});
            if(!rol){
                throw new NotFoundException({message:"rol no encontrado"})
            }
            return rol;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<RolEntity>{
        try {
            const rol=await this.rolRepository.findOne({where:{rol:name}});
            if(!rol){
                throw new NotFoundException({message:"rol no encontrado"})
            }
            return rol;
        } catch (error) {
            throw error;
        }
    }
}
