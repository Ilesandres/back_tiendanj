import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SpiceEntity } from './entity/spice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateSpiceDto } from './dto/create.spice.dto';
import { MessageDto } from 'src/common/message.dto';

@Injectable()
export class SpiceService {
    constructor(
        @InjectRepository(SpiceEntity)
        private readonly spiceRepository:Repository<SpiceEntity>
    ){}

    async create(spice:CreateSpiceDto):Promise<SpiceEntity>{
        try {
            if(!spice)throw new BadRequestException({message:"el sabor es requerido"});
            const spiceExist=await this.spiceRepository.findOne({
                where:{
                    spice:spice.spice
                }
            });
            if(spiceExist)throw new BadRequestException({message:"el sabor ya existe"});
            const newSpice=this.spiceRepository.create(spice);
            return await this.spiceRepository.save(newSpice);
        } catch (error) {
            throw error;
        }
    }

    async findAll():Promise<SpiceEntity[]>{
        try {
            const spices=await this.spiceRepository.find();
            if(spices.length===0)throw new NotFoundException({message:"no hay sabores"});
            return spices;
        } catch (error) {
            throw error;
        }
    }

    async findById(id:number):Promise<SpiceEntity>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const spice=await this.spiceRepository.findOne({where:{id}});
            if(!spice)throw new NotFoundException({message:"el sabor no existe"});
            return spice;
        } catch (error) {
            throw error;
        }
    }

    async findByName(name:string):Promise<SpiceEntity[]>{
        try {
            if(!name)throw new BadRequestException({message:"el nombre es requerido"});
            const spices=await this.spiceRepository.find({where:{spice:name}});
            if(spices.length===0)throw new NotFoundException({message:"no hay sabores con ese nombre"});
            return spices;
        } catch (error) {
            throw error;
        }
    }

    async update(id:number,spice:CreateSpiceDto):Promise<SpiceEntity>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            if(!spice)throw new BadRequestException({message:"el sabor es requerido"});
            const spiceBd=await this.findById(id);
            spice.spice=spice.spice.toLowerCase();
            const spiceExist=await this.spiceRepository.findOne({
                where:{
                    spice:spice.spice,
                    id:Not(id)
                }
            });
            if(spiceExist)throw new BadRequestException({message:"el sabor ya existe"});
            spiceBd.spice=spice.spice;
            const updatedSpice=await this.spiceRepository.save(spiceBd);
            return updatedSpice;
        } catch (error) {
            throw error;
        }    
    }

    async delete(id:number):Promise<MessageDto>{
        try {
            if(!id)throw new BadRequestException({message:"el id es requerido"});
            const spice=await this.findById(id);
            await this.spiceRepository.delete(id);
            return new MessageDto("sabor eliminado correctamente");
        } catch (error) {
            throw error;
        }
    }
}
