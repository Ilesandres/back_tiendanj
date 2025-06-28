import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeDniEntity } from './entity/typedni.entity';
import { Not, Repository } from 'typeorm';
import { CreateCategoryDto } from '../category/dto/create.category.dto';
import { CreateTypeDni } from './dto/create.typedni.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class TypedniService {
    constructor(
        @InjectRepository(TypeDniEntity)
        private readonly typeDniRepository: Repository<TypeDniEntity>,
    ) { }

    async findAll(): Promise<TypeDniEntity[]> {
        try {
            const typeDni= await this.typeDniRepository.find();
            if(!typeDni){
                throw new NotFoundException({message:"tipos de documento no encontrado"});
            }
            return typeDni;
        } catch (error) {
            throw error;
        }

    }
    async findById(id:number):Promise<TypeDniEntity>{
        try {
            const typeDni= await this.typeDniRepository.findOne({where:{id}});
            if(!typeDni){
                throw new NotFoundException({message:"tipo de documento no encontrado"});
            }
            return typeDni;
        } catch (error) {
            throw error;
        }
    }
    async create(typeDni:CreateTypeDni):Promise<TypeDniEntity>{
        try {
            if(!typeDni){
                throw new BadRequestException({message:"tipo de documento no creado"});
            }
            typeDni.name=(typeDni.name.trim()).toUpperCase();
            const typeDniExists=await this.typeDniRepository.findOne({
                where:{
                    name:typeDni.name
                }
            })
            if(typeDniExists){
                throw new BadRequestException({message:"tipo de documento ya existe"});
            }
            const typeDniSaved= await this.typeDniRepository.save({
                name:typeDni.name,
            });
            if(!typeDniSaved){
                throw new BadRequestException({message:"tipo de documento no creado"});
            }
            return typeDniSaved;
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,typeDniAct:CreateTypeDni):Promise<TypeDniEntity>{
        try {
            if(!typeDniAct){
                throw new BadRequestException({message:"tipo de documento requerido"});
            }
            if(!id){
                throw new BadRequestException({message:"id no encontrado"});
            }
            const typeDni=await this.typeDniRepository.findOne({where:{id}});
            if(!typeDni){
                throw new NotFoundException({message:"tipo de documento no encontrado"});
            }
            typeDniAct.name=(typeDniAct.name.trim()).toUpperCase();
            if(typeDniAct.name===""){
                throw new BadRequestException({message:"el nombre es requerido"});
            };
            const typeDniExists=await this.typeDniRepository.findOne({
                where:{
                    name:typeDniAct.name,
                    id:Not(id)
                }
            });
            if(typeDniExists){
                throw new BadRequestException({message:"tipo de documento ya existe"});
            }
            typeDni.name=typeDniAct.name;
            const typeDniUpdated= await this.typeDniRepository.save(typeDni);
            if(!typeDniUpdated){
                throw new BadRequestException({message:"tipo de documento no actualizado"});
            }
            return typeDniUpdated;
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            const typeDni=await this.typeDniRepository.findOne({where:{id}});
            if(!typeDni){
                throw new NotFoundException({message:"tipo de documento no encontrado"});
            }
            await this.typeDniRepository.delete(id);
            return new MessageDto("tipo de documento eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
