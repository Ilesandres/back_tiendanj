import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrderEntity } from './entity/type.order.entity';
import { Not, Repository } from 'typeorm';
import { CreateTypeOrderDto } from './dto/create.typeorder.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class TypeorderService {
    constructor(
        @InjectRepository(TypeOrderEntity)
        private readonly typeOrderRepository:Repository<TypeOrderEntity>
    ){}

    async findAll():Promise<TypeOrderEntity[]>{
        try {
            const typeOrder = await this.typeOrderRepository.find();
            if(typeOrder.length ===0) throw new NotFoundException("no se encontraron tipos de orden");
            return typeOrder;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<TypeOrderEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const typeOrder = await this.typeOrderRepository.findOne({where:{id}});
            if(!typeOrder) throw new NotFoundException("no se encontró el tipo de orden");
            return typeOrder;
        } catch (error) {
            throw error;
        }
    }

    async create(typeOrder:CreateTypeOrderDto):Promise<TypeOrderEntity>{
        try {
            if(!typeOrder) throw new BadRequestException("el tipo de orden es requerido");
            if(!typeOrder.type) throw new BadRequestException("el tipo de orden es requerido");
            typeOrder.type = (typeOrder.type.toLowerCase()).trim();
            const typeOrderExist = await this.typeOrderRepository.findOne({where:{type:typeOrder.type}});
            if(typeOrderExist) throw new BadRequestException("el tipo de orden ya existe");
            const newTypeOrder = this.typeOrderRepository.create(typeOrder);
            return await this.typeOrderRepository.save(newTypeOrder);
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,typeOrder:CreateTypeOrderDto):Promise<TypeOrderEntity>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            if(!typeOrder) throw new BadRequestException("el tipo de orden es requerido");
            if(!typeOrder.type) throw new BadRequestException("el tipo de orden es requerido");
            typeOrder.type = (typeOrder.type.toLowerCase()).trim();
            const typeOrderBd= await this.typeOrderRepository.findOne({
                where:{
                    id:id
                }
            });
            if(!typeOrderBd) throw new NotFoundException("no se encontró el tipo de orden");
            const typeOrderExist = await this.typeOrderRepository.findOne(
                {
                    where:{
                        type:typeOrder.type,
                        id:Not(id)
                    }
                });
            if(typeOrderExist) throw new BadRequestException("el tipo de orden ya existe");
            typeOrderBd.type = typeOrder.type;
            return await this.typeOrderRepository.save(typeOrderBd);
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<TypeOrderEntity>{
        try {
            if(!name) throw new BadRequestException("el nombre es requerido");
            name = (name.toLowerCase()).trim();
            const typeOrder = await this.typeOrderRepository.findOne(
                {
                    where:{
                        type:name
                    }
                });
            if(!typeOrder) throw new NotFoundException("no se encontró el tipo de orden");
            return typeOrder;
        } catch (error) {
            throw error;
        }
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id) throw new BadRequestException("el id es requerido");
            const typeOrder = await this.typeOrderRepository.findOne(
                {
                    where:{
                        id
                    }
                });
            if(!typeOrder) throw new NotFoundException("no se encontró el tipo de orden");
            await this.typeOrderRepository.delete(id);
            return new MessageDto("tipo de orden eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
